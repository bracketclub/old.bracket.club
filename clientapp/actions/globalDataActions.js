let alt = require('../alt');


class GlobalDataActions {
    constructor () {
        this.generateActions('updateLocked', 'updateYear', 'updateSport');
    }

    updateSportYear (sport, year) {
        this.dispatch({sport, year});
    }
}

module.exports = alt.createActions(GlobalDataActions);
