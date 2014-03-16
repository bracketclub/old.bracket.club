var BaseView = require('../views/base');
var _ = require('underscore');


module.exports = BaseView.extend({
    render: function () {
        this.renderAndBind();

        this.modal = this.$el.modal();
        this.modal.on('show.bs.modal', _.bind(this.onShowModal, this));
        this.modal.on('shown.bs.modal', _.bind(this.focusModal, this));
        this.modal.on('hidden.bs.modal', _.bind(this.onModalHidden, this));
        this.modal.on('hide.bs.modal', _.bind(this.onModalHide, this));
        this.modal.modal('show');

        return this;
    },
    onShowModal: function () {},
    focusModal: function () {
        _.defer(_.bind(function () {
            this.modal.find('input, select, textarea').not('[disabled], [type=hidden]').eq(0).focus();
        }, this));
    },
    remove: function () {
        $('.modal-backdrop').remove();
        BaseView.prototype.remove.apply(this, arguments);
    },
    onModalHidden: function () {
        this.modal.remove();
        this.remove();
    },
    onModalHide: function () {
    }
});
