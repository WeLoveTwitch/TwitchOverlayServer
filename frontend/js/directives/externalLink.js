TwitchOverlay.directive('external', function() {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {
			var gui = require('nw.gui');

			if (attrs.href) {
				element.on("click", function (event) {
					gui.Shell.openExternal(attrs.href);
					event.preventDefault();
				});
			}
		}
	}
});
