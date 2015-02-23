TwitchOverlay.directive('colorPicker', function () {

    return {
        restrict: 'EA',
        scope: {
            dataToChange: '=',
            callOnChange: '='
        },
        link: function (scope, element, attrs, ngModelCtrl) {
            scope.dataToChange = scope.dataToChange || "#ffffff";

            element.colpick({
                onSubmit: function (hsb, hex, rgb, el, bySetColor) {
                    console.log('ColorPicker::link', hex);
                    scope.dataToChange = hex;
                    scope.callOnChange(hex);
                }
            });

            element.colpickSetColor(scope.dataToChange.replace("#", ""));
        }
    }

});
