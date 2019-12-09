import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Icon, Button, message } from 'antd';
import path from 'path';
import { promisify } from 'util';
import fs from 'fs';
import log from 'electron-log';
import Card from '../../Common/Card/Card';
import styles from './Settings.scss';
import { PACKS_PATH, DEFAULT_ARGS } from '../../../constants';
import { setJavaArgs } from '../../../actions/settings';
import ForgeManager from './ForgeManager';
import JavaManagerCard from './JavaManagerCard';

const FormItem = Form.Item;

type Props = {
  setJavaArgs: () => void,
  javaArgs: string
};

function Instances(props: Props) {
  const [instanceConfig, setInstanceConfig] = useState(null);
  const [checkingForge, setCheckingForge] = useState(true);
  const [unMounting, setUnMounting] = useState(false);

  let watcher = null;

  async function configManagement() {
    try {
      const configFile = JSON.parse(
        await promisify(fs.readFile)(
          path.join(PACKS_PATH, props.instance, 'config.json')
        )
      );

      setInstanceConfig(configFile);

      watcher = fs.watch(
        path.join(PACKS_PATH, props.instance, 'config.json'),
        { encoding: 'utf8' },
        async (eventType, filename) => {
          const config = JSON.parse(
            await promisify(fs.readFile)(
              path.join(PACKS_PATH, props.instance, 'config.json')
            )
          );
          setInstanceConfig(config);
        }
      );
    } catch (err) {
      log.error(err.message);
    } finally {
      setCheckingForge(false);
    }
  }

  useEffect(() => {
    configManagement();
    return () => {
      watcher.close();
    };
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          await promisify(fs.access)(path.join(PACKS_PATH, values.packName));
          message.warning('An instance with this name already exists.');
        } catch (err) {
          const packFolder = path.join(PACKS_PATH, props.instance);
          const newPackFolder = path.join(PACKS_PATH, values.packName);
          await promisify(fs.rename)(packFolder, newPackFolder);
          props.close();
        }
      }
    });
  }

  const { getFieldDecorator } = props.form;
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.content}>
          <h2>Edit Instance Settings</h2>
          <Form layout="inline" onSubmit={e => handleSubmit(e)}>
            <div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  height: '60px',
                  margin: 0,
                  overflow: 'hidden'
                }}
              >
                <FormItem>
                  {getFieldDecorator('packName', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input a valid name',
                        pattern: new RegExp(
                          '^[a-zA-Z0-9_.-]+( [a-zA-Z0-9_.-]+)*$'
                        )
                      }
                    ],
                    initialValue: props.instance
                  })(
                    <Input
                      size="large"
                      style={{
                        width: 300,
                        display: 'inline-block',
                        height: 60,
                        overflow: 'hidden'
                      }}
                      prefix={
                        <Icon
                          type="play-circle"
                          theme="filled"
                          style={{ color: 'rgba(255,255,255,.8)' }}
                        />
                      }
                      placeholder="Instance Name"
                    />
                  )}
                </FormItem>
                <Button
                  icon="save"
                  size="large"
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: 150,
                    display: 'inline-block',
                    height: 60
                  }}
                >
                  Rename
                </Button>
              </div>
            </div>
          </Form>
          <JavaManagerCard instanceName={props.instance} />
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    javaArgs: state.settings.java.javaArgs,
    overrideJavaArgs: state.settings.java.overrideJavaArgs
  };
}

const mapDispatchToProps = {
  setJavaArgs
};

export default Form.create()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Instances)
);
