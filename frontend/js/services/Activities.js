TwitchOverlay.service('Activities', ['Tick', 'TwitchOverlayServer', function (Tick, TwitchOverlayServer) {

    var activities = [];

    function loadActivities() {
        TwitchOverlayServer.getActivities(function (activitiesFromBackend) {
            activities.length = 0;

            activitiesFromBackend.forEach(function(activity) {
                activities.push(activity);
            });
        });
    }

    loadActivities();

    TwitchOverlayServer.on('activityStream', 'newActivity', function(activity) {
        activities.unshift(activity);
    });

    return {
        get: function () {
            return activities;
        }
    }
}]);
