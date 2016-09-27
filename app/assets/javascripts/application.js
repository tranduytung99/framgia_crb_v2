// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require jquery-ui
//= require moment.min
//= require fullcalendar
//= require calendar
//= require i18n
//= require i18n.js
//= require i18n/translations
//= require select2
//= require user
//= require jquery.timepicker
//= require datepair
//= require jquery.datepair
//= require event
//= require particular_calendar
//= require clipboard.min
//= require notification
//= require websocket_rails/main
//= require websocket.init
//= require base64.min
//= require_self

$(document).on('page:change', function() {
  $('.copied').hide();
  if($('.copy-link').length > 0) {
    var clipboard = new Clipboard('.copy-link');

    clipboard.on('success', function(e) {
      e.clearSelection();
    });

    $('.copy-link').on('click', function() {
      $('.copied').show();
      hideConpied ();
    })
  }
  function hideConpied (){
    setTimeout(function(){ $('.copied').hide(); }, 1000);
  }

  $('#flash-message').delay(2000).slideUp(500, function(){
    $(this).remove();
  });
});

$(document).on('page:change', function() {
  $('.select2-single').select2({
    tags: true,
    placeholder: I18n.t("events.placeholder.choose_place")
  });
  $('.select2-single.create').select2('val', null)

  $('#event_calendar_id').select2({
    tags: true,
    minimumResultsForSearch: Infinity
  });
});
