TwitchOverlay.controller('HomeController', ['$scope', function($scope) {

    var gui = require('nw.gui');

    $scope.openOverlay = function() {
        var win = gui.Window.open('./overlay-frontend/index.html', {
            position: 'center',
            width: 1280,
            height: 720,
            "toolbar": false,
            "frame": false
        });
    };

}]);