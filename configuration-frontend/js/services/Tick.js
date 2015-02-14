TwitchOverlay.service('Tick', ['$rootScope', function($rootScope) {

    var funcs = [];

    (function loop() {
        setTimeout(loop, 1000);
        tick();
    })();

    function tick() {
        funcs.forEach(function(cb) {
            cb();
        });
    }

    return {
        register: function(cb) {
            funcs.push(cb);
            cb();
        }
    }
}]);