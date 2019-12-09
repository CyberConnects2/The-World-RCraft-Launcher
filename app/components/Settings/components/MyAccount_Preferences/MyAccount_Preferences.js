import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ipcRenderer } from 'electron';
import store from '../../../../localStore';
import CIcon from '../../../Common/Icon/Icon';
import CopyIcon from '../../../Common/CopyIcon/CopyIcon';
import styles from './MyAccount_Preferences.scss';
import SettingCard from '../SettingCard/SettingCard';
import Title from '../Title/Title';
import SwitchSetting from '../SwitchSetting/SwitchSetting';
import * as SettingsActions from '../../../../actions/settings';
import SelectSetting from '../SelectSetting/SelectSetting';

const MyAccount = props => {
  const initialChannel =
    store.get('settings') &&
      (store.get('settings').releaseChannel === 'latest' ||
        store.get('settings').releaseChannel === 'beta')
      ? store.get('settings').releaseChannel
      : 'latest';

  const [channel, setChannel] = useState(
    initialChannel === 'latest' ? 'Stable' : 'Beta'
  );
  const { t } = useTranslation();

  return (
    <div>
      <Title>{t('MyAccount', 'My Account')}</Title>
      <div className={styles.accountInfo}>
        <div>
          <CIcon size={70}><img src="https://twilightgamesstudio.com/games/rcraft/skins/Skin.php?size=57&player=${this.props.username}"></img></CIcon>
        </div>
        <div>
          <div className={styles.divider} />
		  <span>{t('Username', 'Username')}</span>
          <span className={styles.info}>{props.username}</span>{' '}
          <CopyIcon text={props.username} />
          <div className={styles.divider} />
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    username: state.auth.displayName,
    email: state.auth.email,
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyAccount);
