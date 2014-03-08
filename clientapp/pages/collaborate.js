var PageView = require('./base');
var templates = require('../templates');
var BracketView = require('../views/bracket');
var SimpleWebRTC = require('simplewebrtc');
var _ = require('underscore');


module.exports = PageView.extend({
    pageTitle: 'Collaborate',
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

        this.listenTo(this.model, 'change:current', app.bracketNavigate);

        this.$('.videos').affix();

        this.setupRTC();
    },
    updateUrl: function (model, val) {
        app.navigate('/collaborate/' + this.roomId + '/' + val, {trigger: false, replace: true});
    },
    hasVideos: function () {
        this.$el.addClass('has-videos');
    },
    addDataChannelToModel: function (channel) {
        // We prefer the reliable channel but we will use unreliable too if we dont have one
        if (channel.label === 'reliable' || (channel.label === 'unreliable' && !this.model.hasDataChannel())) {
            this.model.setDataChannel(channel);
        }
    },
    receiveBracketMessage: function (label, data) {
        if (label === 'reliable' || label === 'unreliable') {
            this.model.receiveBracketUpdate(data);
        }
    },
    setupRTC: function () {
        var self = this;

        this.webrtc = new SimpleWebRTC({
            localVideoEl: 'localVideo',
            remoteVideosEl: 'remotes',
            autoRequestMedia: true
        });

        this.webrtc.on('readyToCall', function () {
            self.webrtc.joinRoom(self.roomId);
        });

        this.webrtc.on('localStream', 'readyToCall', _.bind(this.hasVideos, this));
        this.webrtc.on('channelOpen', _.bind(this.addDataChannelToModel, this));
        this.webrtc.on('message', _.bind(this.receiveBracketMessage, this));
    }
});
