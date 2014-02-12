var config = require('clientconfig');
var url = "https://goinstant.net/f2a0775ca4ce/staticshowdown";


module.exports = function (app) {
    return {
        room: function (model, roomId) {
            if (!roomId) return;
            goinstant.connect(url, {room: roomId}, function (err, connection, room) {
                if (err) return (model || app).trigger('connect:error', err);
                (model || app).trigger('connect:room', connection, room);
            });
        }
    };
};