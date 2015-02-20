TwitchOverlay.service('FrontendComponents', ['TwitchOverlayServer', function (TwitchOverlayServer) {

    var server = TwitchOverlayServer.getServer();
    var componentFactory = server.getComponentFactory();

    return {
        startEditMode: function() {
            componentFactory.setEditMode(true);
        },
        endEditMode: function() {
            componentFactory.setEditMode(false);
        },
        getAvailableComponents: function() {
            return componentFactory.getAvailableComponents();
        },
        getActiveComponents: function() {
            return componentFactory.getActiveComponents();
        },
        create: function(type) {
            return componentFactory.createComponent(type);
        }
    };

}]);
