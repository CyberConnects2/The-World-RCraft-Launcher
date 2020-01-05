// @flow
import React, { Component } from 'react';
import { Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { PACKS_PATH, THEMES } from '../../constants';
import styles from './Home.scss';
import Card from '../Common/Card/Card';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      latestBtnClicked: false,
      latestInstalled: false
    };
  }
  /* eslint-disable */
  openLink(url) {
    require('electron').shell.openExternal(url);
  }

  componentDidMount = async () => {
    try {
      await promisify(fs.access)(path.join(PACKS_PATH, '1.13.2'));
      this.setState({ latestInstalled: true });
    } catch (e) {
      this.setState({ latestInstalled: false });
    }
    // Downloads the versions list just the first time
    if (this.props.versionsManifest.length === 0) {
      this.props.getVanillaMCVersions();
    }
  };

  /* eslint-enable */

  render() {
    return (
      <div>
        <main className={styles.content}>
          <div className={styles.innerContent}>
            <div className={styles.cards}>
			        <Card
                style={{
                  height: 'auto',
                  width: '100%',
                  minWidth: 420,
                  display: 'block',
                  marginTop: 15,
                  textAlign: 'center'
                }}
                title={`Welcome ${this.props.username} to The World R:Craft`}
              >
				        <div>
					        <img width='100%' height="273" src="https://i.imgur.com/lEanUis.jpg"></img>
                </div>
              </Card>
              <Card
                style={{
                  height: 'auto',
                  width: '100%',
                  minWidth: 420,
                  display: 'block',
                  marginTop: 15,
                  textAlign: 'center'
                }}
                title={`Special Thanks to GDLauncher`}
              >
                <div className={styles.firstCard}>
                  <div>
                    <span className={styles.titleHeader}>
                      The World RCraft Launcher is based off GDLauncher. Without GDLauncher this launcher wouldn't be possible so go check out the GDLauncher {' '}
                      <a
                        href="https://patreon.com/gorilladevs"
                        className={styles.patreonText}
                      >
                        Patreon
                      </a>
                    </span>
                    <div className={styles.patreonContent}>
                      If you like GDLauncher and you would like it to have even
                      more features and bug fixes, consider helping us out
                      supporting the project. Happy Gaming!
                    </div>
                  </div>
                  <div>
                    You can find GDLauncher here:
                    <div className={styles.discord}>
                      <a href="https://discord.gg/ZxRxPqn">Discord</a>
                    </div>
                    <div className={styles.github}>
                      <a href="https://github.com/gorilla-devs/GDLauncher">
                        Github
                      </a>
                    </div>
                    <div className={styles.instagram}>
                      <a href="https://instagram.com/gdlauncher">Instagram</a>
                    </div>
                    <div className={styles.facebook}>
                      <a href="https://facebook.com/gorilladevs">Facebook</a>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
