/**
 * Mojang
 * 
 * This module serves as a minimal wrapper for Mojang's REST api.
 * 
 * @module mojang
 */
// Requirements
const request = require('request')
const logger  = require('./loggerutil')('%c[Mojang]', 'color: #a02d2a; font-weight: bold')

const sha1	  = require('sha1')
//const http	  = require('http')

// Constants
const minecraftAgent = {
    name: 'Minecraft',
    version: 1
}
const authpath = 'https://twilightgamesstudio.com/games/rcraft'

// Functions

/**
 * Authenticate a user with their Mojang credentials.
 * 
 * @param {string} username The user's username, this is often an email.
 * @param {string} password The user's password.
 * @param {string} clientToken The launcher's Client Token.
 * @param {boolean} requestUser Optional. Adds user object to the reponse.
 * @param {Object} agent Optional. Provided by default. Adds user info to the response.
 * 
 * @see http://wiki.vg/Authentication#Authenticate
 */
exports.authenticate = function(username, password, clientToken, requestUser = true, agent = minecraftAgent){
	hashedPass = sha1(password)
    return new Promise((resolve, reject) => {
	
        const body = {
            agent,
            username,
            hashedPass,
            requestUser
        }
        if(clientToken != null){
            body.clientToken = clientToken
        }

        request.post(authpath + '/RemoteLogin.php',
            {
                json: true,
                body
            },
            function(error, response, body){
                if(error){
                    logger.error('Error during authentication.', error)
                    reject(error)
                } else {
					if (response.statusCode === 200){
						if (JSON.stringify(body).charAt(2) == "a"){
							resolve(body)	
						}else if (JSON.stringify(body).charAt(2) == "e"){
							reject(body)
						}
					}else{
						reject({code: 'ENOTFOUND'})
					}
					
                }
            })
			
			
			
    })
}

/**
 * Validate an access token. This should always be done before launching.
 * The client token should match the one used to create the access token.
 * 
 * @param {string} accessToken The access token to validate.
 * @param {string} clientToken The launcher's client token.
 * 
 * @see http://wiki.vg/Authentication#Validate
 */
exports.validate = function(accessToken, clientToken){
    return new Promise((resolve, reject) => {
        request.post(authpath + '/validate.php',
            {
                json: true,
                body: {
                    accessToken,
                    clientToken
                }
            },
            function(error, response, body){
                if(error){
                    logger.error('Error during validation.', error)
                    reject(error)
                } else {
                    if(response.statusCode === 403){
                        resolve(false)
                    } else {
                    // 204 if valid
                        resolve(true)
                    }
                }
            })
    })
}

/**
 * Invalidates an access token. The clientToken must match the
 * token used to create the provided accessToken.
 * 
 * @param {string} accessToken The access token to invalidate.
 * @param {string} clientToken The launcher's client token.
 * 
 * @see http://wiki.vg/Authentication#Invalidate
 */
exports.invalidate = function(accessToken, clientToken){
    return new Promise((resolve, reject) => {
        request.post(authpath + '/invalidate.php',
            {
                json: true,
                body: {
                    accessToken,
                    clientToken
                }
            },
            function(error, response, body){
                if(error){
                    logger.error('Error during invalidation.', error)
                    reject(error)
                } else {
                    if(response.statusCode === 204){
                        resolve()
                    } else {
                        reject(body)
                    }
                }
            })
    })
}

/**
 * Refresh a user's authentication. This should be used to keep a user logged
 * in without asking them for their credentials again. A new access token will
 * be generated using a recent invalid access token. See Wiki for more info.
 * 
 * @param {string} accessToken The old access token.
 * @param {string} clientToken The launcher's client token.
 * @param {boolean} requestUser Optional. Adds user object to the reponse.
 * 
 * @see http://wiki.vg/Authentication#Refresh
 */
exports.refresh = function(accessToken, clientToken, requestUser = true){
    return new Promise((resolve, reject) => {
        request.post(authpath + '/refresh.php',
            {
                json: true,
                body: {
                    accessToken,
                    clientToken,
                    requestUser
                }
            },
            function(error, response, body){
                if(error){
                    logger.error('Error during refresh.', error)
                    reject(error)
                } else {
                    if(response.statusCode === 200){
                        resolve(body)
                    } else {
                        reject(body)
                    }
                }
            })
    })
}