var PageView = require('./base');
var templates = require('../templates');


module.exports = PageView.extend({
    template: templates.pages._404,
    props: {
        pageTitle: ['string', true, '404'],
        errorTitle: ['string', true, 'Oh no! This page does not exist!'],
        text: ['string', true, '']
    },
    bindings: {
        errorTitle: {
            type: 'text',
            hook: 'title'
        },
        text: {
            type: 'text',
            hook: 'text'
        }
    }
});
