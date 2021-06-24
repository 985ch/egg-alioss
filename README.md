# egg-alioss

![node version][node-image]
[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[node-image]: https://img.shields.io/badge/node-%3E%3D8-blue.svg
[npm-image]: https://img.shields.io/npm/v/egg-alioss.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-alioss
[download-image]: https://img.shields.io/npm/dm/egg-alioss.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-alioss

该插件基于[ali-oss](https://github.com/aliyun/oss-nodejs-sdk)，在将其封装到egg的基础上还进行了简单的扩展

## 安装

```sh
npm i egg-alioss
```

## 使用方式

```js
// config/plugin.js
exports.alioss = {
  enable: true,
  package: 'egg-alioss',
};
```
```js
// {app_root}/config/config.default.js
exports.alioss = {
  client: {
    accessKeyId: 'your access key',
    accessKeySecret: 'your access secret',
    bucket: 'your bucket',
    endpoint: 'oss-cn-xxx.aliyun.com',
  },
};


// {app_root}/app/****.js
const alioss = app.alioss;

const info = alioss.getUploadToken('abc', 500, []);
```
更多用法参见[ali-oss](https://github.com/aliyun/oss-nodejs-sdk)

## 扩展方法
### getCallbackMD5(ctx)
* 获取回调文件的MD5信息
* ctx是egg.js的controller实例
* 返回上传文件的MD5

### getCallbackJson(url, params, bodyType)
* 计算并获得回调配置
* params是回调时附带的参数JSON，参数值为特定字符串则会被替换为相应内容。
* bodyType可以在application/x-www-form-urlencoded和里二选一
* 返回一个JSON，可以用于getUploadToken

params一览
```
$bucket	 存储空间
$object  对象（文件）
$etag  文件的ETag，即返回给用户的ETag字段
$size  Object大小，CompleteMultipartUpload时为整个Object的大小
$mimeType  资源类型，例如jpeg图片的资源类型为image/jpeg
$imageInfo.height  图片高度
$imageInfo.width  图片宽度
$imageInfo.format  图片格式，例如jpg、png等
```

### getUploadToken(dir, timeout = 600, options = null, callback = null)
* 计算并获取上传凭证并提供给前端
* dir是限制上传的目录
* timeout是凭证有效时间
* options是额外选项
* callback是回调配置，一般通过getCallbackJson获得
* 返回一个JSON，可以用于getUploadToken

options一览
```
maxLength 限制文件最大长度，单位字节
filename 限制文件名
```

## 扩展配置

### callbackHost
回调服务器的地址

## License

[MIT](LICENSE)
