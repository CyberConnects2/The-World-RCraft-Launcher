import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import Modal from '../Common/Modal/Modal';
import styles from './LoginHelperModal.scss';

const DiscordModal = ({ match, history }) => {
  const { t } = useTranslation();
  return (
    <Modal history={history} style={{ height: 550 }}>
      <div className={styles.container}>
        <h3>{t('loginHelperTitle1', 'What login credentials should I use?')}</h3>
        <p>
          {t('loginHelperContent1', 'Our launcher uses your Twilight Game Studio credentials from our forum.')}
        </p>
        <h3>{t('loginHelperTitle2', 'Why should i give you my credentials?')}</h3>
        <p>
          {t('loginHelperContent2', 'We use your credentials to ensure you have an account.')}
        </p>
        <h3>{t('loginHelperTitle4', 'Can I delete the information you have about me?')}</h3>
        <p>
          {t('loginHelperContent4', 'Sure, you can contact us by email (rcraft@twilightgamesstudio.com) and we will remove any information related to you')}
        </p>
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://forums.twilightgamesstudio.com/index.php?help/terms"
          >
            {t('loginHelperContent4_1', 'If you want to know more, you can check out our Terms of Service')}
          </a>
        </p>
      </div>
    </Modal>
  );
};

export default DiscordModal;
