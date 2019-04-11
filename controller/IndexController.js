const Controller = require('../dist/Controller').default;

module.exports = class Index extends Controller {
    index() {
        console.log('hehe');
        this.ctx.body = 'haha';
    }
}
