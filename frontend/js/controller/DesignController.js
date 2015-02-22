TwitchOverlay.controller('DesignController', ['$scope', 'FrontendComponents', function($scope, FrontendComponents) {

    $scope.availableComponents = FrontendComponents.getAvailableComponents();
    $scope.activeComponents = FrontendComponents.getActiveComponents();

    $scope.create = function(type) {
        FrontendComponents.create(type);
    };

    $scope.saveSnapshot = function() {
        console.log('save');
        FrontendComponents.save();
    };

    $scope.startEditMode = function() {
        FrontendComponents.startEditMode();
    };

    $scope.setPosition = function(component) {
        component.positionChanged();
    };

}]);
