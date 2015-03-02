let React = require('react');
let {State, Navigation} = require('react-router');

let Bracket = require('../components/bracket/Container');

let UserNotFound = require('./UserNotFound');


module.exports = React.createClass({
    mixins: [State, Navigation],
    getStateFromUrl () {
        let username = this.getParams().user;
        let game = parseInt(this.getQuery().game, 10);
        let user = app.entries[username];
        return {
            username,
            user,
            bracket: (user || {}).bracket,
            game: isNaN(game) ? app.masters.length - 1 : game,
            masters: app.masters
        };
    },
    getInitialState () {
        return this.getStateFromUrl();
    },
    componentWillReceiveProps () {
        this.setState(this.getStateFromUrl());
    },
    onBracketChange (bracket) {
        this.replaceWith('user', {user: this.state.username}, {game: bracket.historyIndex});
    },
    render () {
        let {user, username, game, masters} = this.state;

        if (!user) {
            return <UserNotFound user={username} />;
        }

        return (<Bracket
            canEdit={false}
            onBracketChange={this.onBracketChange}
            bracketProps={{history: masters, historyIndex: game, entry: user.bracket}}
            bracketConstructor={BracketModel}
            user={user}
        />);
    }
});
