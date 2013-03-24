$(function() {
  $('table.results').tablesorter({
    sortInitialOrder: 'desc',
    headers: {
      1: {sorter: false}
    }
  });
});