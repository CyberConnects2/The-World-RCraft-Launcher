import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ipcRenderer } from 'electron';
import store from '../../../../localStore';
import CIcon from '../../../Common/Icon/Icon';
import CopyIcon from '../../../Common/CopyIcon/CopyIcon';
import styles from './Source.scss';
import SettingCard from '../SettingCard/SettingCard';
import Title from '../Title/Title';
import SwitchSetting from '../SwitchSetting/SwitchSetting';
import * as SettingsActions from '../../../../actions/settings';
import SelectSetting from '../SelectSetting/SelectSetting';

const Source = props => {
  const { t } = useTranslation();

  return (
    <div>
      <Title>{t('MyAccount', 'Source Code')}</Title>
      <div>
        <div>
          <div className={styles.divider} />
		  <span>{t('Username', 'Github')}</span>
          <div className={styles.divider} />
          <a href="https://github.com/CyberConnects2/The-World-RCraft-Launcher">
           <img width="60" height="60" src="https://cyberconnects2.github.io/The-World-RCraft-Launcher/img/github-repo.png"></img>
          </a>
          <div className={styles.divider} />
          <br></br>
          <div className={styles.divider} />
          Original Source
          <div className={styles.divider} />
          <a href="https://github.com/gorilla-devs/GDLauncher">
           <img width="60" height="60" src="https://cyberconnects2.github.io/The-World-RCraft-Launcher/img/github-repo.png"></img>
          </a>
          <div className={styles.divider} />
        </div>
      </div>
    </div>
  );
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch);
}

export default connect(
  mapDispatchToProps
)(Source);