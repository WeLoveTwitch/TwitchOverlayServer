TwitchOverlay.directive('fileDialog', ['$rootScope', function($rootScope) {
  return {
    restrict: 'EA',
    templateUrl: 'frontend/templates/directives/file-dialog.html',
    link: function($scope, element, attrs) {

      var button = element.find('.choose');
      var fileDialog = element.find('.file-dialog');

      button.on('click', function() {
        fileDialog.click();
      });

      fileDialog.on('change', function() {
        $scope.imageUrlChanged(fileDialog.val());
      });

    }
  }

}]);
