(function(window, $, undefined) {
  $(document).ready(function() {
    $('.user-search').submit(function(e) {
      e.preventDefault();
      var val = $(this).find('input').val();
      if (val) {
        window.location.href = "/user/" + val + ".html";
      }
    });
  });
})(window, jQuery);