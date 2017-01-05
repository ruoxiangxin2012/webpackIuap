require(['director'], function(director) {
    var router = new director.Router();

    router.on('/page1', function() {
        require.ensure([], function (require) {
            require('../containers/page1/index')();
        }, 'page1');
    });
    router.on('/page2', function() {
        require.ensure([], function (require) {
            require('../containers/page2/index')();
        }, 'page2');
    });
    router.on('/hello', function() {
        require.ensure([], function (require) {
            require('../containers/hello/index')();
        }, 'hello');
    });
    router.init();
});
