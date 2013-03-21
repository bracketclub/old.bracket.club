(function ($) {

  $(function(){

    $('form.navbar-search').submit(function(e) {
      e.preventDefault();
      var username = $(this).find('input').val();
      if (username) {
        window.location.href = '/user/' + username;
      }
    });

    $('.subnav a.scroll').smoothScroll();

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