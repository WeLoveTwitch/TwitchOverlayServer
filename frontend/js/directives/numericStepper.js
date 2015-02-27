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
          timeoutPromise = null,
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
        $timeout.cancel(timeoutPromise);
        $interval.cancel(intervalPromise);
      });

      scope.increment = function () {
        updateValue(1)
      };

      scope.decrement = function () {
        updateValue(-1);
      };

      scope.toggleMouse = function (direction) {
        $timeout.cancel(timeoutPromise);
        $interval.cancel(intervalPromise);

        if (direction) {
          step(direction);

          timeoutPromise = $timeout(function () {
            startInterval(direction);
          }, 300);
        }
      };

      scope.textChanged = function() {
        $timeout(function () {
          updateValue();
          scope.ngChange();
        }, 0);
      };

      function startInterval(direction) {
        intervalPromise = $interval(function () {
          step(direction);
        }, 75);
      }

      function step(direction) {
        if (direction == 'increment') {
          scope.increment();
        } else {
          scope.decrement();
        }
      }

      function initialize() {
        ngModelCtrl.$setViewValue(scope.ngModel);
      }

      function updateValue(amount) {
        var valueObject = getValueObject();
        var value = '';

        if (valueObject) {
          value = (valueObject.value || 0);
          value = amount ? value + amount : value;
          sizingUnit = valueObject.units;
        }

        value = value || 0;

        setViewValue(value, sizingUnit);
        sanityCheck();
      }

      function setViewValue(value, sizingUnit) {
        ngModelCtrl.$setViewValue(value + sizingUnit);
      }

      function getModelString() {
        return (ngModelCtrl.$viewValue || '').toString();
      }

      function getValueObject() {
        var model = getModelString();

        if (model === '') return false;

        var matches = model.split(/(-?\d+)/);

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
