TwitchOverlay.directive('numericStepper', function () {
  return {
    restrict: 'EA',
    require: 'ngModel',
    scope: {
      ngModel: '='
    },
    replace: true,
    templateUrl: 'frontend/templates/directives/numeric-stepper.html',
    link: function (scope, element, attrs, ngModelCtrl) {
      console.log('NumericStepper::link', ngModelCtrl.$viewValue);

      var sizingUnit = null;
      var css3Lengths = [
        // Percentage
        '%',
        // Font Relative
        'em', 'ex', 'ch', 'rem',
        // Viewport Relative
        'vw', 'vh', 'vmin', 'vmax',
        // Absolute
        'cm', 'mm', 'in', 'px', 'pt', 'pc'
      ];

      scope.$watch(function () {
        return ngModelCtrl.$modelValue;
      }, function (newValue, oldValue) {
        updateValue(0);
      });

      ngModelCtrl.$formatters.unshift(function (value) {
        value = isNaN(parseInt(value)) ? 0 : value;
        return value;
      });

      scope.increment = function () {
        updateValue(1)
      };

      scope.decrement = function () {
        updateValue(-1);
      };

      function updateValue(amount) {
        var matches = ngModelCtrl.$viewValue.toString().split(/(-?\d+)/);
        var value = (parseInt(matches[1]) || 0) + (amount || 0);
        sizingUnit = matches[2].trim();

        ngModelCtrl.$setViewValue(value + sizingUnit);
        sanityCheck();
      }

      function sanityCheck() {
        var validity = css3Lengths.indexOf(sizingUnit) != -1;
        ngModelCtrl.$setValidity('invalidUnits', validity);
      }
    }
  }
});
