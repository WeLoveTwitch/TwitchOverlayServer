TwitchOverlay.directive('nicescroll', ['$interval', function($interval) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            return;
            var scroller = element.niceScroll();

            console.log('Scroller: ', scroller);

            $scope.$watch(function () {
                return element.getSiblings().length;
            }, function () {
                $interval(function () {
                    element.getNiceScroll().resize();
                }, 100, 10)
            })
        }
    }
}]);
