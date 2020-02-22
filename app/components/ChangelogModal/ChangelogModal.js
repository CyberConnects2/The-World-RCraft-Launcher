import React, { useState, useEffect } from 'react';
import store from '../../localStore';
import styles from './ChangelogModal.scss';
import Modal from '../Common/Modal/Modal';
import ChangelogRow from './ChangelogRow';

export default props => {
  const [unMount, setUnMount] = useState(false);

  useEffect(() => {
    store.set('showChangelogs', false);
  }, []);

  const openDiscord = () => {
    require('electron').shell.openExternal('https://discord.gg/5QTdaBs');
  };

  return (
    <Modal
      history={props.history}
      unMount={unMount}
      title={`WHAT'S NEW IN v${require('../../../package.json').version}`}
      style={{ height: '70vh', width: 540 }}
    >
      <div className={styles.container}>

        <h2 className={styles.hrTextGreen}>V1.1.1</h2>
        <div className={styles.subHrList}>
          <ul>
            <ChangelogRow
              main="Did some clean up"
              secondary=" Made things run better!"
            />
          </ul>
        </div>
      </div>
    </Modal >
  );
};
