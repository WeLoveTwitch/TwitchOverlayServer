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
        funcs = funcs.filter(function(cb) {
            cb();
            return cb.__callOnce__ !== true;
        });
    }

    return {
        register: function(cb) {
            funcs.push(cb);
            cb();
        },
        registerOnce: function(cb) {
            cb.__callOnce__ = true;
            this.register(cb);
        }
    }
}]);