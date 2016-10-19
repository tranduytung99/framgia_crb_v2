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
//= require slider
//= require modal

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

  $('#event_place_id').select2({
    tags: true,
    allowClear: true,
    width: '100%',
    placeholder: I18n.t('events.placeholder.choose_place'),
    createTag: function (tag) {
      return {
        id: tag.term,
        text: tag.term,
        isNew : true
      };
    }
  }).on('select2:select', function(e) {
    if(e.params.data.isNew || e.params.data.id == 0){
      $('#name_place').val(e.params.data.text);
    } else {
      $('#name_place').val('');
    }
  });

  $('.select2-single.create').select2('val', null)

  $('#event_calendar_id').select2({
    tags: true,
    width: '100%',
    minimumResultsForSearch: Infinity
  });

  $('#permission-select').select2({
    tags: true,
    minimumResultsForSearch: Infinity
  });

  $('.person-select').select2({
    tags: true,
    minimumResultsForSearch: Infinity,
    placeholder: I18n.t("events.placeholder.choose_person")
  });

  flag = parseInt(localStorage.getItem("isHideSidebarFlag"));
  loadSidebar(flag);
  $('#hide-sidebar-link').click(function(){
    flag = parseInt(localStorage.getItem("isHideSidebarFlag")) === 0 ? 1 : 0;
    loadSidebar(flag);
    localStorage.setItem("isHideSidebarFlag", flag);

    $(this).text(function() {
      if (flag === 0) {
        return I18n.t("layouts.header.hide_sidebar")
      } else {
        return I18n.t("layouts.header.show_sidebar")
      }
    });
  });

  function loadSidebar(flag) {
    flag === 0 ? $('.hide-sidebar').show(200) : $('.hide-sidebar').hide(200);
    $('.fc-view-container').animate({marginLeft: flag*-169}, 200);
    $('#hide-sidebar-link').text(function(){
      if (flag === 0) {
        return I18n.t("layouts.header.hide_sidebar")
      } else {
        return I18n.t("layouts.header.show_sidebar")
      }
    });
  }
});
