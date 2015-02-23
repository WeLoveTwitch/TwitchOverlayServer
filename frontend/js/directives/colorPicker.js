TwitchOverlay.directive('colorPicker', function () {

    return {
        restrict: 'EA',
        require: 'ngModel',
        scope: {
            callback: '&'
        },
        link: function (scope, element, attrs, ngModelCtrl) {
            scope.color = attrs.color || "#ffffff";

            var picker = element.colpick({
                onSubmit: function (hsb, hex, rgb, element, bySetColor) {
                    scope.color = '#' + hex;

                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(scope.color);
                    });

                    scope.callback({ value: hex });
                }
            });

            element.colpickSetColor(scope.color.replace('#', ''));
        }
    }

});
