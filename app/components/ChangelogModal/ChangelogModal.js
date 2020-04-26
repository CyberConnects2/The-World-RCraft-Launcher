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
      title={`The World RCraft Launcher: ${require('../../../package.json').version} Changelog`}
      style={{ height: '70vh', width: 540 }}
    >
      <div className={styles.container}>

        <h2 className={styles.hrTextYellow}>The World RCraft Launcher</h2>
        <span className={styles.summary}>
          Changelog
        </span>
        <div style={{ margin: 15 }} />
        <div className={styles.subHrList}>
          <ul>
            <ChangelogRow
              main="Fixed head not showing correctly."
            />
            <ChangelogRow
              main="Various UI improvements"
            />
			<ChangelogRow
              main="Removed Discord RPC."
            />
          </ul>
        </div>
      </div>
    </Modal >
  );
};
