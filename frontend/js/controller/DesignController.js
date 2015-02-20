TwitchOverlay.controller('DesignController', ['$scope', 'FrontendComponents', function($scope, FrontendComponents) {

    $scope.availableComponents = FrontendComponents.getAvailableComponents();
    $scope.activeComponents = FrontendComponents.getActiveComponents();

    $scope.create = function(type) {
        FrontendComponents.create(type);
    }

}]);
