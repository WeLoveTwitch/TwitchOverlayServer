(function() {
    $().ready(function() {
        var socket = io();
        var newFollowers = [];
        var newFollowerShownSince = 0;
        var showNewFollowersFor = 4000;

        socket.on('reconnect', function() {
            document.location.reload(true);
        });

        socket.on('update', function(data) {
            updateUI(data);
        });

        var currentFollowers = $('.current-followers');
        var targetFollowers = $('.target-followers');
        var newestFollower = $('.newest-follower');
        var newFollowerContainer = $('.new-follower');

        function updateUI(data) {
            data.newFollowers.forEach(function(follower) {
                newFollowers.push(follower);
            });
            currentFollowers.text(data.followerCurrent);
            targetFollowers.text(data.followerTarget);
            newestFollower.text(data.followerNewest);
        }

        setInterval(checkNewFollower, 100);

        function checkNewFollower() {
            var now = new Date().getTime();
            if(newFollowerShownSince !== 0 && newFollowerShownSince + showNewFollowersFor < now) {
                newFollowerShownSince = 0;
                newFollowerContainer.css({top: -100});
                setTimeout(checkNewFollower, 400);
                return;
            }
            if(newFollowers.length === 0 || newFollowerShownSince !== 0) return false;
            var newFollower = newFollowers.shift();
            newFollowerContainer.find('.new-follower-name').text(newFollower);
            newFollowerContainer.css({top: 100});
            newFollowerShownSince = now;
        }
    });
})();