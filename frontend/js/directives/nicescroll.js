TwitchOverlay.directive('nicescroll', ['$interval', function($interval) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var scroller = element.niceScroll({
                bouncescroll: true,
                autohidemode: "cursor",
                hidecursordelay: 3000,
                cursorwidth: 8,
                cursoropacitymax: .3
            });

            $scope.$watch(function () {
                return element.children().length;
            }, function () {
                $interval(function () {
                    scroller.resize();
                }, 100, 10)
            })
        }
    }
}]);
