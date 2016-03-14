import React, {Component} from 'react';
import {Row, Col, Input, Button, PageHeader} from 'react-bootstrap';

import Page from '../components/layout/Page';

export default class SubscribePage extends Component {
  render() {
    return (
      <Page>
        <PageHeader>Subscribe</PageHeader>
        <form target='_blank' action='http://tweetyourbracket.us5.list-manage.com/subscribe/post' method='POST'>
          <input type='hidden' name='u' value='3357cbc15c95f163a6fff3a84' />
          <input type='hidden' name='id' value='2259ac644a' />
          <Row>
            <Col xs={12}>
              <h3 className='text-center'>
                Sign up to receive some pretty cool emails.
              </h3>
              <p className='text-center'>
                There'll be gifs, emoji, announcements of cool new features, and you'll be the first to know every time entries go live.
                <br className='visible-md-block visible-lg-block' />
                {' '}
                Check out <a href='http://us5.campaign-archive2.com/home/?u=3357cbc15c95f163a6fff3a84&id=2259ac644a' target='_blank'>the past newsletters</a> to see what you're in for.
                <br className='visible-md-block visible-lg-block' />
                {' '}
                <em>(But no spam, I promise)</em>
              </p>
              <br />
            </Col>
            <Col xs={12} md={6} mdOffset={3}>
              <Input
                type='email'
                autoCapitalize='off'
                autoCorrect='off'
                name='MERGE0'
                id='MERGE0'
                placeholder='enter@your.email'
              />
            </Col>
            <Col xs={12} md={6} mdOffset={3}>
              <Button type='submit' block bsStyle='primary'>Submit</Button>
            </Col>
          </Row>
        </form>
      </Page>
    );
  }
}
