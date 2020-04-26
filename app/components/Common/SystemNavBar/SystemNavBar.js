// @flow
import React, { Component } from 'react';
import styles from './SystemNavBar.scss';
import WindowCloseBtn from './components/WindowCloseButton/WindowCloseButton';
import WindowMinimizeBtn from './components/WindowMinimizeButton/WindowMinimizeButton';
import WindowHideBtn from './components/WindowHideButton/WindowHideButton';
import OpenDevTools from './components/OpenDevTools/OpenDevTools';
import logo from '../../../assets/images/logo.png';


type Props = {};
export default class SystemNavBar extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.logoText}>
          <img src={logo} height="40px" width="40px" alt="logo" draggable="false" />
        </div>
        <OpenDevTools />
        <WindowCloseBtn />
        <WindowMinimizeBtn />
        <WindowHideBtn />
      </div>
    );
  }
}
