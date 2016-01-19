/* globals ga */

'use strict';

export default {
  enterBracket(bracket) {
    ga('send', 'event', 'bracket-enter', 'click', bracket);
  }
};
