var PageView = require('./base');
var templates = require('../templates');
var BracketView = require('../views/bracket');
var SimpleWebRTC = require('simplewebrtc');


module.exports = PageView.extend({
    pageTitle: 'home',
    template: templates.pages.collaborate,
    initialize: function (options) {
        options || (options = {});
        this.roomId = options.roomId;
    },
    render: function () {
        this.renderAndBind();
        this.renderSubview(new BracketView({
            model: this.model
        }), '.bracket');
        this.setupRTC();
    },
    setupRTC: function () {
        var self = this;
        this.$('.videos').affix();
        // create our webrtc connection
        var webrtc = new SimpleWebRTC({
            localVideoEl: 'localVideo',
            remoteVideosEl: 'remotes',
            autoRequestMedia: true
        });

        webrtc.on('localStream', function () {
            if (self.roomId) {
                self.$el.addClass('has-videos');
            }
        });

        webrtc.on('readyToCall', function () {
            if (self.roomId) {
                self.$el.addClass('has-videos');
                webrtc.joinRoom(self.roomId);
            }
        });
    }
});
