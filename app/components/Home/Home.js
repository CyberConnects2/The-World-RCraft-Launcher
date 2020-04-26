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

// @ts-ignore
type Props = {};

export default // @ts-ignore
class Home extends Component<Props> {
  // @ts-ignore
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
    // Downloads the versions list just the first time
    if (this.props.versionsManifest.length === 0) {
      this.props.getVanillaMCVersions();
    }
    if (this.props.latestMCVersions.release) {
      try {
        await promisify(fs.access)(path.join(PACKS_PATH, this.props.latestMCVersions.release));
        this.setState({ latestInstalled: true });
      } catch (e) {
        this.setState({ latestInstalled: false });
      }
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