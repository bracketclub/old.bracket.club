var PageView = require('./base');
var templates = require('../templates');
var BracketView = require('../views/bracket');
var noRTC = require('../modals/noRTC');
var SimpleWebRTC = require('simplewebrtc');
var _ = require('underscore');


module.exports = PageView.extend({
    pageTitle: function () {
        return 'Collaborate: ' + this.roomId;
    },
    htmlClass: 'bracket-page',
    template: templates.pages.collaborate,
    initialize: function (options) {
        options || (options = {});
        this.roomId = options.roomId;
        this.videoOnly = options.videoOnly;
        this.listenTo(this.model, 'change:current', app.bracketNavigate);
    },
    htmlBindings: {
        enterButton: '[role=enter-button]'
    },
    render: function () {
        this.renderAndBind();

        this.registerSubview(new BracketView({
            model: this.model,
            pickable: app.bracketLock.isPickable,
            el: this.getByRole('bracket')
        }).render());

        this.$('.videos').affix();

        this.webrtc = new SimpleWebRTC({
            localVideoEl: 'localVideo',
            remoteVideosEl: 'remotes',
            autoRequestMedia: true
        });

        if (this.webrtc.capabilities.support) {
            this.setupRTC();
        } else {
            this.noRTC();
        }
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
    noRTC: function () {
        this.registerSubview(new noRTC().render());
    },
    setupRTC: function () {
        var self = this;

        this.webrtc.on('readyToCall', function () {
            self.webrtc.joinRoom(self.roomId);
        });

        this.webrtc.on('localStream', 'readyToCall', _.bind(this.hasVideos, this));

        if (!this.videoOnly) {
            this.webrtc.on('channelOpen', _.bind(this.addDataChannelToModel, this));
            this.webrtc.on('message', _.bind(this.receiveBracketMessage, this));
        }
    }
});
