TwitchOverlay.directive('navToggle', function() {
    return {
        restrict: 'AC',
        link: function($scope, element) {
            element.on("click", function(event) {
                angular.element('body').toggleClass('nav-lg');
                event.preventDefault();
            });
        }
    }
});
