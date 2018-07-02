/**
 * Initialize UI functions which depend on internal modules.
 * Loaded after core UI functions are initialized in uicore.js.
 */
// Requirements
const path          = require('path')
const AuthManager   = require('./assets/js/authmanager.js')
const {AssetGuard}  = require('./assets/js/assetguard.js')
const ConfigManager = require('./assets/js/configmanager.js')

let rscShouldLoad = false
let fatalStartupError = false

// Mapping of each view to their container IDs.
const VIEWS = {
    landing: '#landingContainer',
    login: '#loginContainer',
    settings: '#settingsContainer',
    welcome: '#welcomeContainer'
}

// The currently shown view container.
let currentView

/**
 * Switch launcher views.
 * 
 * @param {string} current The ID of the current view container. 
 * @param {*} next The ID of the next view container.
 * @param {*} currentFadeTime Optional. The fade out time for the current view.
 * @param {*} nextFadeTime Optional. The fade in time for the next view.
 * @param {*} onCurrentFade Optional. Callback function to execute when the current
 * view fades out.
 * @param {*} onNextFade Optional. Callback function to execute when the next view
 * fades in.
 */
function switchView(current, next, currentFadeTime = 500, nextFadeTime = 500, onCurrentFade = () => {}, onNextFade = () => {}){
    currentView = next
    $(`${current}`).fadeOut(currentFadeTime, () => {
        onCurrentFade()
        $(`${next}`).fadeIn(nextFadeTime, () => {
            onNextFade()
        })
    })
}

/**
 * Get the currently shown view container.
 * 
 * @returns {string} The currently shown view container.
 */
function getCurrentView(){
    return currentView
}

function showMainUI(){

    if(!isDev){
        console.log('%c[AutoUpdater]', 'color: #a02d2a; font-weight: bold', 'Initializing..')
        ipcRenderer.send('autoUpdateAction', 'initAutoUpdater', ConfigManager.getAllowPrerelease())
    }

    updateSelectedServer(AssetGuard.getServerById(ConfigManager.getSelectedServer()).name)
    refreshServerStatus()
    setTimeout(() => {
        document.getElementById('frameBar').style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
        document.body.style.backgroundImage = `url('assets/images/backgrounds/${document.body.getAttribute('bkid')}.jpg')`
        $('#main').show()

        const isLoggedIn = Object.keys(ConfigManager.getAuthAccounts()).length > 0

        // If this is enabled in a development environment we'll get ratelimited.
        // The relaunch frequency is usually far too high.
        if(!isDev && isLoggedIn){
            validateSelectedAccount().then((v) => {
                if(v){
                    console.log('%c[AuthManager]', 'color: #209b07; font-weight: bold', 'Account access token validated.')
                } else {
                    console.log('%c[AuthManager]', 'color: #a02d2a; font-weight: bold', 'Account access token  is invalid.')
                }
            })
        }

        if(ConfigManager.isFirstLaunch()){
            currentView = VIEWS.welcome
            $(VIEWS.welcome).fadeIn(1000)
        } else {
            if(isLoggedIn){
                currentView = VIEWS.landing
                $(VIEWS.landing).fadeIn(1000)
            } else {
                currentView = VIEWS.login
                $(VIEWS.login).fadeIn(1000)
            }
        }

        setTimeout(() => {
            $('#loadingContainer').fadeOut(500, () => {
                $('#loadSpinnerImage').removeClass('rotating')
            })
        }, 250)
        
    }, 750)
    // Disable tabbing to the news container.
    initNews().then(() => {
        $("#newsContainer *").attr('tabindex', '-1')
    })
}

function showFatalStartupError(){
    setTimeout(() => {
        $('#loadingContainer').fadeOut(250, () => {
            document.getElementById('overlayContainer').style.background = 'none'
            setOverlayContent(
                'Fatal Error: Unable to Load Distribution Index',
                'A connection could not be established to our servers to download the distribution index. No local copies were available to load. <br><br>The distribution index is an essential file which provides the latest server information. The launcher is unable to start without it. Ensure you are connected to the internet and relaunch the application.',
                'Close'
            )
            setOverlayHandler(() => {
                const window = remote.getCurrentWindow()
                window.close()
            })
            toggleOverlay(true)
        })
    }, 750)
}

/**
 * Common functions to perform after refreshing the distro index.
 * 
 * @param {Object} data The distro index object.
 */
function onDistroRefresh(data){
    updateSelectedServer(AssetGuard.getServerById(ConfigManager.getSelectedServer()).name)
    refreshServerStatus()
    initNews()
    syncModConfigurations(data)
}

/**
 * Sync the mod configurations with the distro index.
 * 
 * @param {Object} data The distro index object.
 */
function syncModConfigurations(data){

    const syncedCfgs = []

    const servers = data.servers

    for(let i=0; i<servers.length; i++){

        const id = servers[i].id
        const mdls = servers[i].modules
        const cfg = ConfigManager.getModConfiguration(servers[i].id)

        if(cfg != null){

            const modsOld = cfg.mods
            const mods = {}

            for(let j=0; j<mdls.length; j++){
                const mdl = mdls[j]
                if(mdl.type === 'forgemod' || mdl.type === 'litemod' || mdl.type === 'liteloader'){
                    if(mdl.required != null && mdl.required.value != null && mdl.required.value === false){
                        const mdlID = AssetGuard._resolveWithoutVersion(mdl.id)
                        if(modsOld[mdlID] == null){
                            mods[mdlID] = scanOptionalSubModules(mdl.sub_modules, mdl)
                        } else {
                            mods[mdlID] = mergeModConfiguration(modsOld[mdlID], scanOptionalSubModules(mdl.sub_modules, mdl))
                        }
                    }
                }
            }

            syncedCfgs.push({
                id,
                mods
            })

        } else {

            const mods = {}

            for(let j=0; j<mdls.length; j++){
                const mdl = mdls[j]
                if(mdl.type === 'forgemod' || mdl.type === 'litemod' || mdl.type === 'liteloader'){
                    if(mdl.required != null && mdl.required.value != null && mdl.required.value === false){
                        mods[AssetGuard._resolveWithoutVersion(mdl.id)] = scanOptionalSubModules(mdl.sub_modules, mdl)
                    }
                }
            }

            syncedCfgs.push({
                id,
                mods
            })

        }
    }

    ConfigManager.setModConfigurations(syncedCfgs)
    ConfigManager.save()
}

/**
 * Recursively scan for optional sub modules. If none are found,
 * this function returns a boolean. If optional sub modules do exist,
 * a recursive configuration object is returned.
 * 
 * @returns {boolean | Object} The resolved mod configuration.
 */
function scanOptionalSubModules(mdls, origin){
    if(mdls != null){
        const mods = {}

        for(let i=0; i<mdls.length; i++){
            const mdl = mdls[i]
            // Optional types.
            if(mdl.type === 'forgemod' || mdl.type === 'litemod' || mdl.type === 'liteloader'){
                // It is optional.
                if(mdl.required != null && mdl.required.value != null && mdl.required.value === false){
                    mods[AssetGuard._resolveWithoutVersion(mdl.id)] = scanOptionalSubModules(mdl.sub_modules, mdl)
                }
            }
        }

        if(Object.keys(mods).length > 0){
            return {
                value: origin.required != null && origin.required.def != null ? origin.required.def : true,
                mods
            }
        }
    }
    return origin.required != null && origin.required.def != null ? origin.required.def : true
}

/**
 * Recursively merge an old configuration into a new configuration.
 * 
 * @param {boolean | Object} o The old configuration value.
 * @param {boolean | Object} n The new configuration value.
 * 
 * @returns {boolean | Object} The merged configuration.
 */
function mergeModConfiguration(o, n){
    if(typeof o === 'boolean'){
        if(typeof n === 'boolean') return o
        else if(typeof n === 'object'){
            n.value = o
            return n
        }
    } else if(typeof o === 'object'){
        if(typeof n === 'boolean') return o.value
        else if(typeof n === 'object'){
            n.value = o.value

            const newMods = Object.keys(n.mods)
            for(let i=0; i<newMods.length; i++){

                const mod = newMods[i]
                if(o.mods[mod] != null){
                    n.mods[mod] = mergeModConfiguration(o.mods[mod], n.mods[mod])
                }
            }

            return n
        }
    }
    // If for some reason we haven't been able to merge,
    // wipe the old value and use the new one. Just to be safe
    return n
}

function refreshDistributionIndex(remote, onSuccess, onError){
    if(remote){
        AssetGuard.refreshDistributionDataRemote(ConfigManager.getLauncherDirectory())
        .then(onSuccess)
        .catch(onError)
    } else {
        AssetGuard.refreshDistributionDataLocal(ConfigManager.getLauncherDirectory())
        .then(onSuccess)
        .catch(onError)
    }
}

async function validateSelectedAccount(){
    const selectedAcc = ConfigManager.getSelectedAccount()
    if(selectedAcc != null){
        const val = await AuthManager.validateSelected()
        if(!val){
            ConfigManager.removeAuthAccount(selectedAcc.uuid)
            ConfigManager.save()
            const accLen = Object.keys(ConfigManager.getAuthAccounts()).length
            setOverlayContent(
                'Failed to Refresh Login',
                `We were unable to refresh the login for <strong>${selectedAcc.displayName}</strong>. Please ${accLen > 0 ? 'select another account or ' : ''} login again.`,
                'Login',
                'Select Another Account'
            )
            setOverlayHandler(() => {
                document.getElementById('loginUsername').value = selectedAcc.username
                validateEmail(selectedAcc.username)
                loginViewOnSuccess = getCurrentView()
                switchView(getCurrentView(), VIEWS.login)
                toggleOverlay(false)
            })
            setDismissHandler(() => {
                if(accLen > 1){
                    prepareAccountSelectionList()
                    $('#overlayContent').fadeOut(250, () => {
                        $('#accountSelectContent').fadeIn(250)
                    })
                } else {
                    const accountsObj = ConfigManager.getAuthAccounts()
                    const accounts = Array.from(Object.keys(accountsObj), v => accountsObj[v]);
                    // This function validates the account switch.
                    setSelectedAccount(accounts[0].uuid)
                    toggleOverlay(false)
                }
            })
            toggleOverlay(true, accLen > 0)
        } else {
            return true
        }
    } else {
        return true
    }
}

/**
 * Temporary function to update the selected account along
 * with the relevent UI elements.
 * 
 * @param {string} uuid The UUID of the account.
 */
function setSelectedAccount(uuid){
    const authAcc = ConfigManager.setSelectedAccount(uuid)
    ConfigManager.save()
    updateSelectedAccount(authAcc)
    validateSelectedAccount()
}

// Synchronous Listener
document.addEventListener('readystatechange', function(){

    if (document.readyState === 'complete'){
        if(rscShouldLoad){
            if(!fatalStartupError){
                showMainUI()
            } else {
                showFatalStartupError()
            }
        } 
    } else if(document.readyState === 'interactive'){
        //toggleOverlay(true, 'loadingContent')
    }

    /*if (document.readyState === 'interactive'){
        
    }*/
}, false)

// Actions that must be performed after the distribution index is downloaded.
ipcRenderer.on('distributionIndexDone', (event, data) => {
    if(data != null) {
        syncModConfigurations(data)
        if(document.readyState === 'complete'){
            showMainUI()
        } else {
            rscShouldLoad = true
        }
    } else {
        fatalStartupError = true
        if(document.readyState === 'complete'){
           showFatalStartupError()
        } else {
            rscShouldLoad = true
        }
    }
})