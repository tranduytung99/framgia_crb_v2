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
//= require jquery-ui
//= require moment.min
//= require moment-timezone-with-data-2010-2020.min
//= require fullcalendar
//= require gcal
//= require i18n
//= require i18n.js
//= require i18n/translations
//= require select2
//= require user
//= require jquery.timepicker
//= require datepair
//= require jquery.datepair
//= require event
//= require clipboard.min
//= require notification
//= require base64.min
//= require_self
//= require scheduler
//= require bootstrap/tab
//= require bootstrap/modal
//= require room_search
//= require organization
//= require load_user_ajax

$(document).on('ready', function() {
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

  $('#calendar_owner_id').select2({
    minimumResultsForSearch: Infinity
  }).on('select2:select', function(e) {
    var ownerType = $(this).select2("data")[0].element.attributes["data-owner-type"].value;
    $('#calendar_owner_type').val(ownerType);
  });

  $('.timezone-select').select2({
    width: '100%'
  });

  $('.country-select').select2({
    width: '100%'
  });

  $('.calendar-select').select2({
    width: '100%'
  });

  flag = parseInt(localStorage.getItem("isHideSidebarFlag"));
  loadSidebar(flag);

  $(document).keydown(function(e){
    if (e.which === 39 && e.ctrlKey){
      flag = 1;
      loadSidebar(flag);
    } else if (e.which === 37 && e.ctrlKey){
      flag = 0;
      loadSidebar(flag);
    }
  });

  function loadSidebar(flag) {
    if (flag === 1) {
      $('.hide-sidebar').show(200);
      $('.fc-view-container').animate({marginLeft: 0}, 200);
    } else {
      $('.hide-sidebar').hide(200);
      $('.fc-view-container').animate({marginLeft: -184}, 200);
    }
    localStorage.setItem("isHideSidebarFlag", flag);
  }
});

function add_fields(link, association, content){
  var new_id = new Date().getTime();
  var regexp = new RegExp("new_" + association, "g");
  $(link).parent().append(content.replace(regexp, new_id));
}

function remove_fields(link){
  $(link).parent().parent().remove();
}
