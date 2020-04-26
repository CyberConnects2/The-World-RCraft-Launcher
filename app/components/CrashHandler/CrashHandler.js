import React from 'react';
import { remote } from 'electron';
import { Button } from 'antd';
import creeper from '../../assets/images/creeper.png';

import styles from './CrashHandler.scss';

export default props => {
  return (
    <div className={styles.main}>
      <div>
        <img src={creeper} />
        <h1>The World RCraft Launcher Crashed</h1>
        <Button
          type="primary"
          onClick={() => {
            remote.app.relaunch();
            remote.app.quit();
          }}
        >
          Restart he World RCraft Launcher
        </Button>
      </div>
    </div>
  );
};
