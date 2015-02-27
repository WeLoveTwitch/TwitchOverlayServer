TwitchOverlay.controller('ImageComponentController', ['$scope', function($scope, TwitchOverlayServer) {

  $scope.cacheBuster = 0;
  $scope.imageUrlChanged = function(url) {
    $scope.component.handleImageUrl(url, function() {
      $scope.cacheBuster++;
      if(!$scope.$$phase) {
        $scope.$digest();
      }
    });
  };

}]);
