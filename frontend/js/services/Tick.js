TwitchOverlay.service('Tick', ['$rootScope', function($rootScope) {

    var funcs = [];

    (function loop() {
        setTimeout(loop, 1000);
        tick();
        if(!$rootScope.$$phase) {
            $rootScope.$apply();
        }
    })();

    function tick() {
        funcs = funcs.filter(function(objs) {
            objs.cb();
            return objs.once !== true;
        });
    }

    return {
        register: function(cb) {
            funcs.push({
				cb: cb
			});
			cb();
        },
        registerOnce: function(cb) {
            funcs.push({
				cb: cb,
				once: true
			});
        }
    }
}]);