$(document).ready(function() {
  $("#search-user").keydown(function load_ajax() {
    $.ajax({
      url: '/search_user/index',
      type: 'get',
      dateType: 'text',
      data: {
        email: $('#search-user').val(),
        org_slug: $('#organ_slug').val()
      },
      success: function(result) {
        $('#result').html(result);
      }
    });
  });
});
