'use strict';

const mock = require('egg-mock');

describe('test/alioss.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/alioss-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('test complete')
      .expect(200);
  });
});
