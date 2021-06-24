'use strict';

const OSS = require('./lib/oss');
const assert = require('assert');

// 检查配置是否正确
function checkBucketConfig(config) {
  assert(config.endpoint || config.region,
    '[egg-alioss] Must set `endpoint` or `region` in oss\'s config');
  assert(config.accessKeySecret && config.accessKeyId,
    '[egg-alioss] Must set `accessKeyId` and `accessKeySecret` in oss\'s config');
}

// 构建OSS实例
function createInstance(config, app) {
  config = Object.assign({}, config, { urllib: app.httpclient });
  checkBucketConfig(config);
  return new OSS(config);
}


module.exports = app => {
  if (app.config.alioss)app.addSingleton('alioss', createInstance);
};
