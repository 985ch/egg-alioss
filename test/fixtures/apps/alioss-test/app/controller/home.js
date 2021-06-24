'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { app, ctx } = this;
    app.alioss.getUploadToken('abc', 500, []);
    ctx.body = 'test complete';
  }
}

module.exports = HomeController;
