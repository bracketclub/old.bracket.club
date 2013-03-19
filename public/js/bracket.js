/*global Backbone, _ */


var app;

var BracketRouter = Backbone.Router.extend({
  routes: {
    ':bracket': 'bracket'
  },
  initialize: function() {
    new BracketView();
  },
  bracket: function(bracket) {
    //console.log(bracket);
  }
});

var BracketModel = Backbone.Model.extend({
  defaults: {

  },
  initialize: function() {
    this.listenTo('change', this.attrChange);
  }
});

var BracketView = Backbone.View.extend({
  events: {
    'click a.game': 'gameClick'
  },
  el: '#bracket',
  gameClick: function(e) {

    e.preventDefault();

    var $target = $(e.target),
        $matchup = $target.parents('.matchup'),
        $thisRound = $matchup.parents('.round'),
        $thisRegion = $thisRound.parents('.bracket'),
        isFinal = ($thisRegion.attr('id') === 'FF'),
        $nextRound = $thisRound.next(),
        $nextRounds = $thisRound.nextAll(),
        $winnerGoesTo = $nextRound.find('a').eq($matchup.index());

    if ($winnerGoesTo.data('seed') && $target.data('seed') !== $winnerGoesTo.data('seed')) {
      $nextRounds.find('[data-seed="' + $winnerGoesTo.data('seed') + '"]').replaceWith('<a>&nbsp;</a>');
      this.$el.find('.bracket').last()
        .find('[data-seed="' + $winnerGoesTo.data('seed') + '"][data-from-region="' + $winnerGoesTo.data('from-region') + '"]')
        .replaceWith('<a>&nbsp;</a>');
    }

    if ($nextRound.length > 0) {
      $nextRound.find('a').eq($matchup.index()).replaceWith($target.clone());
    }

    if ($nextRound.length === $nextRounds.length && !isFinal) {
      this.$el.find('.bracket').last().find('a').eq($thisRegion.index()).replaceWith($target.clone());
    }

    if (isFinal && $winnerGoesTo.data('from-region') && $target.data('from-region') !== $winnerGoesTo.data('from-region')) {
      $nextRounds.find('[data-from-region="' + $winnerGoesTo.data('from-region') + '"]').replaceWith('<a>&nbsp;</a>');
    }
    var bc = this.getBracketCode();
    app.navigate('#' + bc, {trigger: false});

    var href = 'https://twitter.com/intent/tweet?hashtags=tybrkt&via=tweetthebracket&url=';

    if (bc.indexOf('X') > -1) {
      $('#tweet-button').addClass('disabled');
      $('#tweet-button').attr('href', '').click(function(e){return false;});
    } else {
      $('#tweet-button').removeClass('disabled');
      $('#tweet-button').unbind().attr('href', href + encodeURIComponent(window.location.href));
    }
    return false;
  },
  getBracketCode: function() {
    return _.map(this.$el.find('.bracket'), function(item) {
      return this.getRegionCode(item.id);
    }, this).join('');
  },
  getRegionCode: function(regionId) {
    var $region = this.$el.find('#' + regionId);
    return regionId + _.map($region.find('.round:gt(0) a'), function(item) { return ((regionId === 'FF') ? $(item).data('from-region') : $(item).data('seed')) || 'X';}).join('');
  }
});


(function ($) {

  $(function(){

    app = new BracketRouter();
    Backbone.history.start({pushState: false});

    $('form.navbar-search').submit(function(e) {
      e.preventDefault();
      var username = $(this).find('input').val();
      if (username) {
        window.location.href = '/user/' + username;
      }
    });

    $('.subnav a').smoothScroll();

    // fix sub nav on scroll
    var $win = $(window),
        $body = $('body'),
        $nav = $('.subnav'),
        navHeight = $('.navbar').first().height(),
        subnavTop = $('.subnav').length && $('.subnav').offset().top - navHeight,
        isFixed = 0;

    if ($('.subnav').length > 0) {
      processScroll();

      $win.on('scroll', processScroll);
    }

    function processScroll() {
      var i, scrollTop = $win.scrollTop();

      if (scrollTop >= subnavTop && !isFixed) {
        isFixed = 1;
        $nav.addClass('subnav-fixed');
        $body.addClass('has-subnav-fixed');
      } else if (scrollTop <= subnavTop && isFixed) {
        isFixed = 0;
        $nav.removeClass('subnav-fixed');
        $body.removeClass('has-subnav-fixed');
      }
    }

  });

})(window.jQuery);