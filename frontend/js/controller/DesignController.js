TwitchOverlay.controller('DesignController', ['$scope', 'FrontendComponents', function($scope, FrontendComponents) {

    $scope.isDisabled = true;

    $scope.availableComponents = FrontendComponents.getAvailableComponents();
    $scope.activeComponents = FrontendComponents.getActiveComponents();

    $scope.create = function(type) {
        FrontendComponents.create(type);
    };

    $scope.saveSnapshot = function() {
        console.log('save');
        FrontendComponents.save();
    };

    $scope.toggleEditMode = function() {
        $scope.isDisabled = !$scope.isDisabled;

        if ($scope.isDisabled) {
            FrontendComponents.startEditMode();
        } else {
            FrontendComponents.endEditMode();
        }
    };

}]);
