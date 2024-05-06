import { resolve } from 'path';
import { readFileSync } from 'fs';

const loadConfig = (sysName: string) => {
  const path_info = (basepath, nodepath) =>
    `./apps/${sysName}/src/config/${basepath}/${nodepath}`;
  // TODO: 这个path_info 要改一下，因为我们不再是用 webpack去编译了
  const loadEnv = process.env.ENV;
  const pathName = resolve(path_info(loadEnv, 'settings.json'));
  const value = readFileSync(pathName, 'utf-8');

  // 先获取 setting
  const setting = JSON.parse(value);
  // 从 setting 开始执行 merge ，如果遇到 remote 先不处理，它需要在 zk 模块处理
  const config = {};

  (setting.configs as any[]).forEach((nodeInfo) => {
    if (nodeInfo.type !== 'local') return;
    config[nodeInfo.node] = JSON.parse(
      readFileSync(resolve(path_info(loadEnv, nodeInfo.value)), 'utf-8'),
    );
  });

  return {
    setting: setting,
    localValue: config,
  };
};

export { loadConfig };
