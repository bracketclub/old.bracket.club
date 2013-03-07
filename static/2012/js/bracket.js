(function(window, $, undefined) {
  $(document).ready(function() {
    
    $('.user-search').submit(function(e) {
      e.preventDefault();
      var val = $(this).find('input').val();
      console.log(val);
      if (val) {
        window.location.href = "/user/"+val+".html";
      }
    });
    
    var region = '.region',
        round = '.round',
        pickable = 'a.pickable',
        finalFour = '#FF_region',
        $content = $('#content'),
        $tweetHolder = $('#navigation .tweet-button-holder');
    
    
    $content.on('click', 'a.pickable', function(e) {
      e.preventDefault();
      
      var $winner = $(this),
          $round = $winner.parents(round),
          $region = $round.parents(region),
          regionId = $region.attr('id').replace('_region', ''),
          $nextRounds = $round.nextAll(round),
          $nextRound = $nextRounds.eq(0),
          gameIndex = Math.floor($round.find(pickable).index($winner) / 2),
          $nextGame = $nextRound.find(pickable).eq(gameIndex),
          previousWinner = $.trim($nextGame.text()),
          winner = $.trim($winner.text());
          
      if ($content.find('.alert-error').length > 0) {
        $content.find('.alert-error').slideUp();
      }
      
      if (previousWinner && previousWinner !== winner) {
        if (regionId !== 'FF') {
          $nextRounds = $nextRounds.add($content.find(finalFour));
        }
        $nextRounds.find(pickable+':contains("'+previousWinner+'")').html('&nbsp;');
      }
      
      $nextGame.text(winner);
      
      if ($winner.data('from-region')) {
        $nextGame.data('from-region', $winner.data('from-region'));
      }
      
      if ($round.hasClass('elite-eight')) {
        var regionIndex = $content.find(region).index($region);
        $content.find(finalFour).find(pickable).eq(regionIndex).text(winner).data('from-region', regionId);
      }
      
      stringBuilder();
    });
    
    function checkCompletion() {
      var regionIds = [];
      
      $content.find(region).each(function() {
        regionIds.push($(this).attr('id').replace('_region', ''));
      });
      
      var regionPicks = _.without(
        _.compact(
          window.location.hash.replace('#', '').split(
            new RegExp('('+regionIds.join('|')+')')
          )
        ), regionIds),
        allPicks = _.flatten(regionPicks).join('');
        
      _.each(regionPicks, function(regionPick, regionId) {
        var $region = $content.find(region).eq(regionId);
        if (regionPick.indexOf('X') === -1) {
          $region.addClass('completed');
        } else {
          $region.removeClass('completed');
        }
      });
      
      if (allPicks && allPicks.indexOf('X') === -1) {
        $content.find('#FF_region').addClass('completed');
        $content.find('#bracket').addClass('completed');
        $content.find('#bracket_holder').addClass('completed');
        updateTweet();
      } else {
        removeTweet();
        $content.find('#FF_region').removeClass('completed');
        $content.find('#bracket').removeClass('completed');
        $content.find('#bracket_holder').removeClass('completed');
      }
    }
    
    function removeTweet() {
      $tweetHolder
        .removeClass('ready')
        .addClass('not-ready')
        .find('.twitter-share-button').remove();
    }

    function updateTweet() {
      
      var tweet = $("<a/>", {
        "href": "https://twitter.com/intent/tweet",
        "class": "twitter-share-button",
        "text": "Tweet",
        "data-url": "http://" + window.location.host + "/" + window.location.hash,
        "data-text": "I filled out my NCAA tournament bracket!",
        "data-size": "large",
        "data-hashtags": "tybrkt",
        "data-via": "TweetTheBracket"
      });
      removeTweet();
      $tweetHolder
        .addClass('ready')
        .removeClass('not-ready')
        .append(tweet);
        
      
      if (typeof twttr !== 'undefined') twttr.widgets.load();
    }
    
    function stringBuilder() {
      var str = "";
      $('.region').each(function() {
        
        var $reg = $(this),
            regId = $reg.attr('id').replace('_region', '');
        
        str += regId; 
        
        $(this).find('.winners '+pickable).each(function() {
          var $this = $(this),
              text = $.trim($this.text());

          if (text) {
            text = (regId === 'FF') ? $this.data('fromRegion') : text.match(/[0-9]+/)[0];
          } else {
            text = 'X';
          }
          
          str += text;
        });
      });
      window.location.hash = str;
      checkCompletion();
    }
    
    
    if ($content.find('#bracket_holder').length > 0) {
      stringBuilder();
    } else {
      $tweetHolder.remove();
    }
    
  });
})(window, jQuery);