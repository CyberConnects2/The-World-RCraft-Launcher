// @flow
import React, { Component } from 'react';
import { remote } from 'electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-solid-svg-icons';
import styles from './WindowGDLogoButton.scss';

type Props = {};
export default class GDLogo extends Component<Props> {
  props: Props;

  GDLogo = () => {
    const w = remote.getCurrentWindow();
    if (w.isMaximized()) {
      w.unmaximize();
    } else if (w.isMaximizable()) {
      w.maximize();
    }
  };

  render() {
    return (
      <div>
        <button className={styles.CloseBtn} onClick={this.GDLogo}>
          <FontAwesomeIcon
            icon={faTwitch}
            style={{ width: '40px', height: '35px' }}
          />
        </button>
      </div>
    );
  }
}
