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
            model: this.model,
            pickable: true
        }), '[role=bracket]');

        this.listenTo(this.model, 'userUpdateBracket', this.sendData);

        this.setupRTC();
    },
    sendData: function () {
        if (this.dataChannel) {
            this.dataChannel.send(this.model.current);
        }
    },
    setupRTC: function () {
        var self = this;
        this.$('.videos').affix();

        this.webrtc = new SimpleWebRTC({
            localVideoEl: 'localVideo',
            remoteVideosEl: 'remotes',
            autoRequestMedia: true,
            debug: true
        });

        this.webrtc.on('localStream', function () {
            self.$el.addClass('has-videos');
            self.sendData();
        });

        this.webrtc.on('readyToCall', function () {
            self.$el.addClass('has-videos');
            self.webrtc.joinRoom(self.roomId);
        });

        this.webrtc.on('channelOpen', function (channel) {
            if (channel.label === 'reliable') {
                self.dataChannel = channel;
            }
        });

        this.webrtc.on('message', function (label, data) {
            if (label === 'reliable') {
                self.model.replaceBracket(data);
            }
        });
    }
});
