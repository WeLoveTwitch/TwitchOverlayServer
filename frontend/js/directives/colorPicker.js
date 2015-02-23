TwitchOverlay.directive('colorPicker', ['$timeout', function ($timeout) {

    return {
        restrict: 'EA',
        require: 'ngModel',
        scope: {
            callback: '&'
        },
        link: function (scope, element, attrs, ngModelCtrl) {
            scope.color = ngModelCtrl.$viewValue || "#6441a5";

            var picker = element.colpick({
                layout: 'rgbhex',
                color: scope.color,
                onChange: function (hsb, hex, rgb, element, bySetColor) {
                    if (bySetColor) {
                        update(hex);
                    }
                },
                onSubmit: function (hsb, hex, rgb, element, bySetColor) {
                    update(hex);
                }
            });

            function update(hexColor) {
                scope.color = '#' + hexColor;

                $timeout(function() {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(scope.color);
                    });
                });

                scope.callback({ value: hexColor });
            }

            picker.colpickSetColor(scope.color);
        }
    }

}]);
