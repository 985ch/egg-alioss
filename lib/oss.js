'use strict';

const querystring = require('querystring');
const OSS = require('ali-oss');
const crypto = require('crypto');

// OSS回调转义参数
const ossCallbackParams = [
  'bucket', //	存储空间
  'object', // 对象（文件）
  'etag',	// 文件的ETag，即返回给用户的ETag字段
  'size',	// Object大小，CompleteMultipartUpload时为整个Object的大小
  'mimeType',	// 资源类型，例如jpeg图片的资源类型为image/jpeg
  'imageInfo.height',	// 图片高度
  'imageInfo.width', // 图片宽度
  'imageInfo.format',	// 图片格式，例如jpg、png等
];

class MyOSS extends OSS {
  constructor(config) {
    super(config);
    this.callbackHost = config.callbackHost;
  }
  // 获取回调文件的MD5信息
  getCallbackMD5(ctx) {
    const raw = ctx.get('Content-MD5');
    return Buffer.from(raw, 'base64').toString('hex');
  }
  // 计算并获得回调配置
  getCallbackJson(url, params, bodyType) {
    bodyType = bodyType || 'application/x-www-form-urlencoded';

    let body;
    let rpStrs;
    if (bodyType === 'application/x-www-form-urlencoded') {
      body = querystring.stringify(params);
      rpStrs = [ '=', '%24%7B', '%7D' ];
    } else {
      body = JSON.stringify(params);
      rpStrs = [ ':', '"${', '}"' ];
    }
    for (const param of ossCallbackParams) {
      body = body.replace(rpStrs[0] + rpStrs[1] + param + rpStrs[2], rpStrs[0] + '${' + param + '}');
    }

    return {
      callbackUrl: encodeURI((this.callbackHost || '') + url),
      callbackBody: body,
      callbackBodyType: bodyType,
    };
  }
  // 根据传入的JSON得到上传凭证规则
  getConditions(dir, options = null) {
    const { maxLength, filename } = options || {};

    const conditions = [];
    if (maxLength) {
      conditions.push([ 'content-length-range', 1, maxLength ]);
    }

    if (filename) {
      conditions.push([ 'eq', '$key', dir + '/' + filename ]);
    } else {
      conditions.push([ 'starts-with', '$key', dir + '/' ]);
    }

    return conditions;
  }
  // 计算并获取上传凭证并提供给前端
  getUploadToken(dir, timeout = 600, options = null, callback = null) {
    const { options: config } = this;
    // 规则配置
    const expire = new Date(Date.now() + timeout * 1000).toISOString();
    const policy = {
      expiration: expire,
      conditions: this.getConditions(dir, options),
    };

    const policyBase64 = new Buffer.from(JSON.stringify(policy)).toString('base64');
    const signature = crypto.createHmac('sha1', config.accessKeySecret).update(policyBase64).digest('base64');

    // 拼接结果
    const info = {
      accessid: config.accessKeyId,
      host: `//${config.bucket}.${config.region}.aliyuncs.com`,
      policy: policyBase64,
      signature,
      expire,
      dir,
    };

    // 回调设置
    if (callback) {
      info.callback = Buffer.from(JSON.stringify(callback)).toString('base64');
    }

    return info;
  }
}

module.exports = MyOSS;
