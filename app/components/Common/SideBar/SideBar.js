// @flow
import React, { useState, useEffect } from 'react';
import { Icon, Button, Popover } from 'antd';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { promisify } from 'util';
import CIcon from '../Icon/Icon';
import SocialIcon from './SocialIcon';
import vanillaCover from '../../../assets/images/minecraft_vanilla_cover.jpg';
import forgeIcon from '../../../assets/images/forge_icon.jpg';

import styles from './SideBar.scss';
import { PACKS_PATH } from '../../../constants';

import * as AuthActions from '../../../actions/auth';
import * as ProfileActions from '../../../actions/profile';

type Props = {};

const SideBar = props => {
  const [instanceData, setInstanceData] = useState(null);

  const UpdateSideBar = async () => {
    if (props.selectedInstance !== null) {
      const data = JSON.parse(
        await promisify(fs.readFile)(
          path.join(PACKS_PATH, props.selectedInstance, 'config.json')
        )
      );

      let mods = 0;

      try {
        mods = (await fs.readdirAsync(
          path.join(PACKS_PATH, props.selectedInstance, 'mods')
        ))
          .filter(el => el !== 'GDLCompanion.jar' && el !== 'LJF.jar')
          .filter(
            el => path.extname(el) === '.zip' || path.extname(el) === '.jar'
          ).length;
      } catch {}

      try {
        const thumbnail = await promisify(fs.readFile)(
          path.join(PACKS_PATH, props.selectedInstance, 'thumbnail.png')
        );
        setInstanceData({
          ...data,
          thumbnail: `data:image/png;base64,${thumbnail.toString('base64')}`,
          mods
        });
      } catch {
        setInstanceData({
          ...data,
          mods,
          thumbnail: null
        });
      }
    } else {
      setInstanceData(null);
    }
  };

  useEffect(() => {
    UpdateSideBar();
  }, [props.selectedInstance]);

  return (
    <aside className={styles.sidenav}>
      <div className={styles.account}>
        <div className={styles.header}>
          <span>
            <CIcon size={32}>
              {<img src="http://twilightgamesstudio.com/games/rcraft/face.php?user=$props.username" width="32" height="32"></img>}
            </CIcon>
          </span>
          <span>{props.username}</span>
          <div onClick={() => props.logout()}>
            <FontAwesomeIcon icon={faSignOutAlt} className={styles.logout} />
          </div>
        </div>
      </div>
      <div className={styles.scroller} />
      <div className={styles.socialsContainer}>
        {/* eslint-disable */}
        <span className={styles.version}>
          <Link to={{ pathname: '/changelogs', state: { modal: true } }}>
            v{require('../../../../package.json').version}
          </Link>
        </span>
        {/* eslint-enable */}
      </div>
    </aside>
  );
};

const mapStateToProps = state => ({
  username: state.auth.displayName,
  selectedInstance: state.instancesManager.selectedInstance
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...AuthActions, ...ProfileActions }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar);
