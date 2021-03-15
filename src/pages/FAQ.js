import React, { Component } from 'react'
import { PageHeader } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import qs from 'query-string'
import { last } from 'lodash'
import bracket from 'lib/bracket'
import { or as joiner } from 'lib/stringJoiner'
import Page from '../components/layout/Page'

export default class FAQPage extends Component {
  render() {
    const ncaaData = bracket({ sport: 'ncaam', year: '2017' })
    const nbaNhlData = bracket({ sport: 'nba', year: '2017' })

    return (
      <Page>
        <PageHeader>Frequently Asked Questions </PageHeader>

        <h4>What is this?</h4>
        <p>
          Bracket Club allows you to enter your NCAA Tournament picks using only
          your Twitter account. Compete against all of Twitter with just a
          tweet.
        </p>
        <p>
          <em>/end-elevatorpitch</em> For reals though, I love brackets so I
          built a bracket challenge site so I could add all the features I’ve
          ever wanted. If you also love (or even just like) brackets, you’ll
          probably have a good time here.
        </p>

        <hr />

        <h4>Why do I have to tweet my entry?</h4>
        <p>
          It started as a bit of a gimmick because I wanted to test{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://gist.github.com/lukekarrys/2028007#why"
          >
            if you could fit a serialized NCAA tournament bracket in a tweet
          </a>
          . It stuck around because I think it’s fun to share your picks on
          Twitter.
        </p>
        <p>
          It also has the added bonus that in case someone submits a perfect
          bracket, I can point to the original tweet in case someone thinks some
          random little bracket challenge site forged a perfect bracket for the
          publicity.
        </p>

        <hr />

        <h4>Can I delete my tweet after I enter?</h4>
        <p>
          Technically yes, but I’d prefer if you didn’t 😄 (meaning that you
          will still be entered on the site even if your tweet no longer
          exists). But just think about how you’d want the tweet as proof if you
          ever filled out a perfect bracket!
        </p>

        <hr />

        <h4>How many times can I enter?</h4>
        <p>
          Once per Twitter account. If you want to change your entry, just tweet
          a new bracket from the same account. In fact, you can tweet as many
          entries as you want from a single account, but only the latest entry
          will be used as your official one.
        </p>

        <hr />

        <h4>Can I enter with a private Twitter account?</h4>
        <p>
          At this time, only entries from public Twitter accounts will work.
        </p>

        <hr />

        <h4>Can I delete my entry?</h4>
        <p>
          That’s not yet possible from the site, but if you{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`mailto:luke@lukekarrys.com?${qs.stringify({
              subject: 'Bracket Club',
            })}`}
          >
            drop me a line
          </a>{' '}
          I’ll be more than happy to remove it from the database.
        </p>

        <hr />

        <h4>How are entries scored?</h4>

        <strong>NCAA</strong>
        <br />
        <p>
          Each round is worth a maximum of {last(ncaaData.scoring)} points, so
          each game is worth{' '}
          <code>{last(ncaaData.scoring)} / GAMES_PER_ROUND</code>, which works
          itself out to {joiner(ncaaData.scoring)} points per game per round.
          This has the effect of making games in later rounds worth more than
          earlier rounds.
        </p>

        <p>
          Entries are also scored using the{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.wsj.com/articles/SB10001424052748704507404576178923020853478"
          >
            Gooley Scoring Method
          </a>
          . This is mostly for fun because it makes it easy to see{' '}
          <Link to="/ncaam-2014/entries?sort=gooley%7Cdesc">
            who picked the best upsets
          </Link>{' '}
          or{' '}
          <Link to="/ncaam-2014/entries?game=0&sort=gooleyPPR%7Cdesc">
            who had the most potential madness in their bracket at the start
          </Link>
          , but it is also used as the tiebreaker.
        </p>

        <strong>NBA and NHL</strong>
        <br />
        <p>
          A correct pick in each round from the first round to the championship
          is worth {joiner(nbaNhlData.scoring.map(([round]) => round))} points
          respectively.
        </p>

        <p>
          Each pick is also awarded a bonus of{' '}
          {joiner(nbaNhlData.scoring.map(([, bonus]) => bonus))} points (again
          going from the first round to the championship) if the correct number
          of games of that series is predicted as well. However, the bonus is
          only awarded if the winner is correctly predicted as well as both
          participants. In the first round you always have the participants
          correct, so you only need to predict the winner and the number of
          games.
        </p>

        <p>
          But if for example, in the 2nd round of the NHL Playoffs you pick
          Chicago over Minnesota in 7 games, but Chicago ends up beating St.
          Louis in 7 games, then you would get 25 points for correctly picking
          Chicago, but you <em>would not</em> get the {nbaNhlData.scoring[1][1]}{' '}
          bonus points because both participants were not correct.
        </p>

        <hr />

        <h4>Who made this?</h4>
        <p>
          Hey, thanks for asking! I’m{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://lukekarrys.com/"
          >
            Luke
          </a>
          . I’ve always been into code and brackets, so I was bound to make
          something like this eventually. A bunch of it is open source, so if
          you’re into that sort of thing, you can{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/bracketclub"
          >
            check it out on GitHub
          </a>
          . You can get in touch{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`mailto:luke@lukekarrys.com?${qs.stringify({
              subject: 'Bracket Club FAQ',
            })}`}
          >
            via email
          </a>{' '}
          if there’s something bracket related you want to chat about.
        </p>

        <hr />

        <h4>How does it work? Why did you make this?</h4>
        <p>
          I talked about those things and a few others over on{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://lukecod.es/categories/tweet-your-bracket/"
          >
            my code blog
          </a>
          , so you should check that out if you’re really curious.
        </p>

        <hr />

        <h4>Will you remind me when to enter?</h4>
        <p>
          Of course! <Link to="subscribe">Sign up for the newsletter</Link> and
          I’ll let you know when brackets open and some other infrequent updates
          like when I add cool stuff to the site.
        </p>
      </Page>
    )
  }
}
