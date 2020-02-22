import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SketchPicker } from 'react-color';
import { useTranslation } from 'react-i18next';
import styles from './UserInterface.scss';
import SettingCard from '../SettingCard/SettingCard';
import Title from '../Title/Title';
import SelectSetting from '../SelectSetting/SelectSetting';
import * as SettingsActions from '../../../../actions/settings';
import shader from '../../../../utils/colors';
import { THEMES } from '../../../../constants';

const themes = ['Blue', 'Black', 'Green'];
const primaryPresets = [
  '#16a085',
  '#27ae60',
  '#2980b9',
  '#8e44ad',
  '#2c3e50',
  '#f39c12',
  '#d35400',
  '#c0392b',
  '#f9ca24',
  '#f0932b',
  '#eb4d4b',
  '#6ab04c',
  '#4834d4',
  '#0097e6',
  '#8c7ae6',
  '#192a56'
];

const secondaryPresets = [
  '#34495e',
  '#2c3e50',
  '#95a5a6',
  '#bdc3c7',
  '#353b48',
  '#2f3640',
  '#192a56',
  '#273c75',
  '#2c2c54',
  '#4b6584',
  '#c23616',
  '#B2263D',
  '#D4582F',
  '#1B1464',
  '#0c2461',
  '#0a3d62'
];

const UserInterface = props => {
  const { t } = useTranslation();
  return (
    <div>
      <Title>{t('UserInterfacePreferences', 'User Interface Preferences')}</Title>
      <SettingCard>
        <SelectSetting
          mainText={
            <span>
              {t('SelectedTheme', 'Select Theme')}{' '}
            </span>
          }
          description={t('AdjustValuesToFitTaste', 'Custom Themes will be selectable here.')}
          icon="layout"
          placeholder={t('SelectATheme', 'Select A Theme')}
          onChange={v =>
            props.applyTheme(
              THEMES[Object.keys(THEMES).find(ver => THEMES[ver].name === v)]
            )
          }
          options={Object.keys(THEMES).map(t => THEMES[t].name)}
        />
      </SettingCard>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInterface);
