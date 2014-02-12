var HumanModel = require('human-model');


module.exports = HumanModel.define({
    type: 'user',
    props: {
        id: ['string', true, 'anonymous'],
        firstName: ['string', true, ''],
        lastName: ['string', true, ''],
        username: ['string'],
    }
});
