var BaseView = require('../views/base');
var bind = require('underscore').bind;


module.exports = BaseView.extend({
    render: function () {
        this.renderAndBind();

        this.modal = this.$el.modal();
        this.modal.on('show.bs.modal', bind(this.onShowModal, this));
        this.modal.on('shown.bs.modal', bind(this.focusModal, this));
        this.modal.on('hidden.bs.modal', bind(this.onModalHidden, this));
        this.modal.on('hide.bs.modal', bind(this.onModalHide, this));
        this.modal.modal('show');

        return this;
    },
    'show.bs.modal': function () {},
    'shown.bs.modal': function () {
        setTimeout(bind(function () {
            this.modal.find('input, select, textarea').not('[disabled], [type=hidden]').eq(0).focus();
        }, this), 1);
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
