let React = require('react');

let Grid = require('react-bootstrap/lib/Grid');
let Row = require('react-bootstrap/lib/Row');
let Col = require('react-bootstrap/lib/Col');
let Input = require('react-bootstrap/lib/Input');
let Button = require('react-bootstrap/lib/Button');


module.exports = React.createClass({
    render () {
        return (
            <form style={{paddingBottom: '1000px'}} target='_blank' action='http://tweetyourbracket.us5.list-manage.com/subscribe/post' method='POST'>
                <input type='hidden' name='u' value='3357cbc15c95f163a6fff3a84' />
                <input type='hidden' name='id' value='2259ac644a' />
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <h3>Sign up to be notified on all the latest Tweet Your Bracket news.</h3>
                            <p>We'll never spam you or do bad things with your email. Promise.</p>
                        </Col>
                        <Col xs={12} md={4} lg={3}>
                            <Input type='email' autoCapitalize='off' autoCorrect='off' name='MERGE0' id='MERGE0' label='Email Address' />
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3}>
                            <Input type='text' name='MERGE1' id='MERGE1' label='First name' />
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3}>
                            <Input type='text' name='MERGE2' id='MERGE2' label='Last name' />
                        </Col>
                        <div className='clearfix' />
                        <Col xs={12} md={2} lg={2}>
                            <Button type='submit' block bsStyle='primary'>Submit</Button>
                        </Col>
                    </Row>
                </Grid>
            </form>
        );
    }
});
