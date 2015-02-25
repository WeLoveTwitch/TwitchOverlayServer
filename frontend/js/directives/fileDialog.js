TwitchOverlay.directive('fileDialog', [function() {
  return {
    restrict: 'EA',
    scope: {
      onChange: '&'
    },
    templateUrl: 'frontend/templates/directives/file-dialog.html',
    link: function($scope, element, attrs) {

      var button = element.find('.choose');
      var fileDialog = element.find('.file-dialog');

      button.on('click', function() {
        fileDialog.click();
      });

      fileDialog.on('change', function() {
        $scope.onChange($(this).val());
      });

    }
  }

}]);
