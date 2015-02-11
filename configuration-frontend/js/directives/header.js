TwitchOverlay.directive('header', [function() {
    return {
        restrict: 'E',
        templateUrl: 'configuration-frontend/templates/directives/header.html',
        link: function($scope) {
            var gui = require('nw.gui');
            var win = gui.Window.get();

            $scope.goFullscreen = function() {
                win.toggleFullscreen();
            };

            $scope.showDevTools = function() {
                win.showDevTools();
            };

            $scope.reload = function() {
                win.reloadIgnoringCache();
            };
        }
    }
}]);