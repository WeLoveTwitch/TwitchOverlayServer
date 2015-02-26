TwitchOverlay.directive('numericStepper', ['$interval', '$timeout', function ($interval, $timeout) {
  return {
    restrict: 'EA',
    require: 'ngModel',
    scope: {
      ngModel: '=',
      ngChange: '&'
    },
    replace: true,
    templateUrl: 'frontend/templates/directives/numeric-stepper.html',
    link: function (scope, element, attrs, ngModelCtrl) {
      const KEY_UP = 38,
          KEY_DOWN = 40;

      var intervalPromise = null,
          sizingUnit = "px",
          css3Lengths = [
            // Percentage
            '%',
            // Font Relative
            'em', 'ex', 'ch', 'rem',
            // Viewport Relative
            'vw', 'vh', 'vmin', 'vmax',
            // Absolute
            'cm', 'mm', 'in', 'px', 'pt', 'pc'
          ];

      element.bind("keydown keypress", function (event) {
        switch (event.which) {
          case KEY_UP:
            scope.increment();
            event.preventDefault();
            break;
          case KEY_DOWN:
            scope.decrement();
            event.preventDefault();
            break;
        }
      });

      element.find('button').bind("blur", function (event) {
        $interval.cancel(intervalPromise);
      });

      scope.increment = function () {
        updateValue(1)
      };

      scope.decrement = function () {
        updateValue(-1);
      };

      scope.toggleMouse = function (value) {
        $interval.cancel(intervalPromise);

        if (value) {
          intervalPromise = $interval(function () {
            if (value == 'increment') {
              scope.increment();
            } else {
              scope.decrement();
            }
          }, 75);
        }
      };

      scope.textChanged = function() {
        $timeout(function () {
          updateValue();
          scope.ngChange();
        }, 0);
      };

      function initialize() {
        updateValue(null, true);
      }

      function updateValue(amount, init) {
        var valueObject = getValueObject(),
            value = '';

        if (valueObject) {
          value = (valueObject.value || 0);
          value = amount ? value + amount : value;
          sizingUnit = init ? sizingUnit : valueObject.units;
        }

        value = init ? 0 : value;

        ngModelCtrl.$setViewValue(value + sizingUnit);
        sanityCheck();
      }

      function getModelString() {
        return (ngModelCtrl.$viewValue || '').toString();
      }

      function getValueObject() {
        var model = getModelString();

        if (model === '') return false;

        var matches = getModelString().split(/(-?\d+)/);

        return {
          value: (parseInt(matches[1]) || 0),
          units: (matches[2] || '').trim()
        }
      }

      function sanityCheck() {
        var validity = css3Lengths.indexOf(sizingUnit) != -1;
        ngModelCtrl.$setValidity('invalidUnits', validity);
      }

      initialize();
    }
  }

}]);
