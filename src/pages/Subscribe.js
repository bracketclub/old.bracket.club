import config from 'config';
import React, {Component} from 'react';
import {Col, Form, FormGroup, FormControl, Button, PageHeader} from 'react-bootstrap';

import Page from '../components/layout/Page';

export default class SubscribePage extends Component {
  render() {
    return (
      <Page>
        <PageHeader>Subscribe</PageHeader>
        <Form horizontal target='_blank' action={config.mailchimp.url} method='POST'>
          <input type='hidden' name='u' value={config.mailchimp.u} />
          <input type='hidden' name='id' value={config.mailchimp.id} />
          <FormGroup>
            <Col xs={12}>
              <h3 className='text-center'>
                Sign up to receive some pretty cool emails.
              </h3>
              <p className='text-center margin-collapse'>
                There'll be gifs, emoji, announcements of cool new features, and you'll be the first to know every time entries go live.
                <br className='visible-md-block visible-lg-block' />
                {' '}
                Check out <a href='http://us5.campaign-archive2.com/home/?u=3357cbc15c95f163a6fff3a84&id=2259ac644a' target='_blank'>the past newsletters</a> to see what you're in for.
                <br className='visible-md-block visible-lg-block' />
                {' '}
                <em>(But no spam, I promise)</em>
              </p>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col xs={12} md={6} mdOffset={3}>
              <FormControl
                type='email'
                autoCapitalize='off'
                autoCorrect='off'
                name='MERGE0'
                id='MERGE0'
                placeholder='enter@your.email'
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col xs={12} md={6} mdOffset={3}>
              <Button type='submit' block bsStyle='primary'>Submit</Button>
            </Col>
          </FormGroup>
        </Form>
      </Page>
    );
  }
}
