$(document).on('ready', function() {
  var $calendar = $('#full-calendar');
  var $miniCalendar = $('#mini-calendar');

  $('.fc-prev-button, .fc-next-button, .fc-today-button').click(function() {
    var moment = $calendar.fullCalendar('getDate');
    $miniCalendar.datepicker();
    $miniCalendar.datepicker('setDate', new Date(moment.format('MM/DD/YYYY')));
  });

  $miniCalendar.datepicker({
    dateFormat: 'DD, d MM, yy',
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    onSelect: function(dateText,dp) {
      $calendar.fullCalendar('gotoDate', new Date(Date.parse(dateText)));
      $(this).datepicker('setDate', new Date(Date.parse(dateText)));
    }
  });

  $('.create').click(function() {
    if ($(this).parent().hasClass('open')) {
      $(this).parent().removeClass('open');
    } else {
      $(this).parent().addClass('open');
    };
  });

  $('.btn-show-popup').click(function() {
    if ($(this).parent().closest('div').hasClass('open')) {
      $(this).parent().closest('div').removeClass('open');
    } else {
      $(this).parent().closest('div').addClass('open');
      event.stopPropagation();
    };
  });

  $('.close-popup-organization').click(function() {
    if ($(this).closest('div.btn-group').hasClass('open')) {
      $(this).closest('div.btn-group').removeClass('open');
    } else {
      $(this).closest('div.btn-group').addClass('open');
      event.stopPropagation();
    };
  });

  $('#clst_my').click(function() {
    if ($('#collapse1').hasClass('in')) {
      $('#collapse1').removeClass('in')
      $('#my-zippy-arrow').removeClass('down');
    } else{
      $('#collapse1').addClass('in')
      $('#my-zippy-arrow').addClass('down');
    };
  });

  $('#clst_other').click(function() {
    if ($('#collapse2').hasClass('in')) {
      $('#collapse2').removeClass('in')
      $('#other-zippy-arrow').removeClass('down');
    } else {
      $('#collapse2').addClass('in')
      $('#other-zippy-arrow').addClass('down');
    };
  });

  // $('#title-mini-calendar').click(function() {
  //   $miniCalendar.removeClass('out');
  //   $('#title-mini-calendar').removeClass('in');
  // });

  // $('.ui-datepicker-title').click(function() {
  //   $('#title-mini-calendar').addClass('in');
  //   $miniCalendar.addClass('out');
  // });

  // $('.ui-datepicker').on('click', '.ui-datepicker-title', function() {
  //   $('#title-mini-calendar').addClass('in');
  //   $miniCalendar.addClass('out');
  // });

  $(document).keydown(function(e) {
    if (e.keyCode == 27) {
      $('#source-popup').removeClass('open');
      $('#sub-menu-my-calendar, #menu-of-calendar, #sub-menu-setting').removeClass('sub-menu-visible');
      $('#sub-menu-my-calendar, #menu-of-calendar, #sub-menu-setting').addClass('sub-menu-hidden');
      $('.list-group-item').removeClass('background-hover');
      $('.sub-list').removeClass('background-hover');
      hiddenDialog('new-event-dialog');
      hiddenDialog('popup');
      hiddenDialog('dialog-update-popup');
    }
  });

  $('#btn-quick-add').on('click', function(event) {
    event.preventDefault();
    var title = $('#title-event-value').val();
    var user_id = $('#current-user-id-popup').html();
    var title = JSON.stringify({title: title.toString()});
    window.location.href = '/events/new?fdata=' + Base64.encode(title);
  });

  $('#clst_my_menu').click(function() {
    var position = $('#clst_my_menu').offset();
    $('#menu-of-calendar').removeClass('sub-menu-visible');
    $('#menu-of-calendar').addClass('sub-menu-hidden');
    $('#source-popup').removeClass('open');
    $('#sub-menu-my-calendar').css({'top': position.top + 13, 'left': position.left});
    if ($('#sub-menu-my-calendar').hasClass('sub-menu-visible')){
      $('#sub-menu-my-calendar').removeClass('sub-menu-visible');
      $('#sub-menu-my-calendar').addClass('sub-menu-hidden');
    } else{
      $('#sub-menu-my-calendar').removeClass('sub-menu-hidden');
      $('#sub-menu-my-calendar').addClass('sub-menu-visible');
    };
    event.stopPropagation();
  });

  $(document).click(function() {
    $('#sub-menu-my-calendar').removeClass('sub-menu-visible');
    $('#sub-menu-my-calendar').addClass('sub-menu-hidden');
    if (!$(event.target).hasClass('clstMenu-child')) {
      $('#menu-of-calendar').removeClass('sub-menu-visible');
      $('#menu-of-calendar').addClass('sub-menu-hidden');
    };
    if ($('#menu-of-calendar').hasClass('sub-menu-hidden')) {
      $('.list-group-item').removeClass('background-hover');
      $('.sub-list').removeClass('background-hover');
    };
  });

  $('.clstMenu-child').click(function() {
    var windowH = $(window).height();
    var position = $(this).offset();
    // if ($(this).find('.sub').length > 0)
    //   $('#create-sub-calendar').parent().addClass('hidden-menu');
    // else
    //   $('#create-sub-calendar').parent().removeClass('hidden-menu');

    $('#id-of-calendar').html($(this).attr('id'));
    var selectedColorId = $(this).attr('selected_color_id');

    var menu_height = $('#menu-of-calendar').height();
    if ((position.top + 12 + menu_height) >= windowH ) {
      $('#menu-of-calendar').css({'top': position.top - menu_height - 2, 'left': position.left});
    }else {
      $('#menu-of-calendar').css({'top': position.top + 12, 'left': position.left});
    };

    if ($('#menu-of-calendar').hasClass('sub-menu-visible')) {
      $('#menu-of-calendar').removeClass('sub-menu-visible');
      $('#menu-of-calendar').addClass('sub-menu-hidden');
      $(this).parent().removeClass('background-hover');
    } else{
      $('#menu-of-calendar div.bcp-selected').removeClass('bcp-selected');

      $('#menu-of-calendar').removeClass('sub-menu-hidden');
      $('#menu-of-calendar').addClass('sub-menu-visible');
      $('#menu-of-calendar div[data-color-id="'+ selectedColorId +'"] div').addClass('bcp-selected');

      $(this).parent().addClass('background-hover');
      rel = $(this).attr('rel');
      $('input:checkbox[id=input-color-' + rel+ ']').prop('checked', true);
      $('#menu-calendar-id').attr('rel', $(this).attr('id'));
    };
  });

  // $('#create-sub-calendar').click(function() {
  //   var id_calendar = $('#id-of-calendar').html();
  //   var user_id = $('#current-user-id-popup').html();
  //   var create_sub_link = '/calendars/' + 'new?parent_id=' + id_calendar.toString();
  //   $('#create-sub-calendar').attr('href', create_sub_link);
  // });

  $('#edit-calendar').click(function() {
    var id_calendar = $('#id-of-calendar').html();
    var user_id = $('#current-user-id-popup').html();
    var edit_link = '/calendars/' + id_calendar.toString() + '/edit';
    $('#edit-calendar').attr('href', edit_link);
  });

  var mousewheelEvent = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";

  $miniCalendar.bind(mousewheelEvent, function(e) {
    if(e.originalEvent.wheelDelta > 60) {
      $('.ui-datepicker-next').click();
    } else{
      $('.ui-datepicker-prev').click();
    };
  });
});
