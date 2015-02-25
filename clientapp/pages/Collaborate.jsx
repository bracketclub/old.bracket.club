let React = require('react');


module.exports = React.createClass({
    render () {
        return (

            // .modal.fade(tabindex="-1", role="dialog")
            //   .modal-dialog
            //     form.modal-content
            //       .modal-header
            //         button(type="button", class="close", data-dismiss="modal") &times;
            //         h3.modal-title Collaborate on your bracket!

            //       .modal-body.row
            //         p.col-xs-12
            //           strong Let your friends help with your bracket!
            //           |  Enter the name of the room that you'd like to create, and a URL will be set. Just send the URL to any friends and they will be able to follow along and help you pick your bracket.
            //         .form-group.col-xs-12
            //           input.form-control(type="text", placeholder="Room name...", name="roomId")
            //         .col-xs-12.form-group
            //           label
            //             input(type="checkbox", name="useLocal")
            //             |  Would you like to use your current bracket to start?

            //       .modal-footer
            //         button.btn.btn-default(type="button", data-dismiss="modal") Cancel
            //         button.btn.btn-primary(type="submit") I Want To Go To There
        );
    }
});
