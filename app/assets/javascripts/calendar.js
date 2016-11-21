$(document).on('page:change', function() {
  var $calendar = $('#full-calendar');
  var $calContent = $('#calcontent');
  var avatarHeader = $('#header-avatar');
  var googleCalendarApiKey = avatarHeader.attr('data-google-api-key');
  var timezoneCurrentUser = avatarHeader.data('timezone');
  var timezoneNameCurrentUser = avatarHeader.data('timezone-name');
  var day_format = I18n.t('events.time.formats.day_format');
  var mousewheelEvent = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";
  var start_date, finish_date, lastestView;

  function googleCalendarsData() {
    if ($calendar.length > 0) {
      var calendars = [];
      $('input:checkbox[class=calendar-checkbox]:checked').each(function() {
        calendars.push({
          googleCalendarId: $(this).attr('google_calendar_id')
        });
      });

      return calendars;
    } else {
      return [];
    }
  }

  if (localStorage.getItem('lastestView') !== null)
    lastestView = localStorage.getItem('lastestView');
  else
    lastestView = 'agendaWeek';

  $calendar.fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'agendaDay,agendaWeek,month,agendaFourDay'
    },
    views: {
      agendaFourDay: {
        type: 'agenda',
        duration: {days: 4},
        buttonText: '4 days'
      }
    },
    borderColor: '#fff',
    eventBorderColor: '#fff',
    eventColor: '#4285f4',
    defaultView: lastestView,
    editable: true,
    selectHelper: true,
    unselectAuto: false,
    nowIndicator: true,
    allDaySlot: true,
    eventLimit: true,
    allDayDefault: false,
    selectable: {
      month: false,
      agenda: true
    },
    height: $(window).height() - $('header').height() - 20,
    googleCalendarApiKey: 'AIzaSyBhk4cnXogD9jtzPVsp_zuJuEKhBRC-skI',
    eventSources: googleCalendarsData(),
    // timezone: timezoneCurrentUser,
    events: function(start, end, timezone, callback) {
      var calendar_ids = [];
      $('input:checkbox[class=calendar-checkbox]:checked').each(function() {
        calendar_ids.push($(this).val());
      });
      var start_time_view = $calendar.fullCalendar('getView').start;
      var end_time_view = $calendar.fullCalendar('getView').end;
      $.ajax({
        url: '/events',
        data: {
          calendar_ids: calendar_ids,
          start_time_view: moment(start_time_view).format(),
          end_time_view: moment(end_time_view).format(),
        },
        dataType: 'json',
        success: function(response) {
          var events = [];
          events = response.events.map(function(data) {
            return {
              title: data.name_place + ': ' + data.title,
              summary: data.title,
              start: moment(data.start_date).utcOffset(timezoneCurrentUser * 60).format(I18n.t('events.time.formats.time_format')),
              end: moment(data.finish_date).utcOffset(timezoneCurrentUser * 60).format(I18n.t('events.time.formats.time_format')),
              id: data.id,
              className: 'color-' + data.color_id,
              calendar: data.calendar,
              allDay: data.all_day,
              repeat_type: data.repeat_type,
              end_repeat: data.end_repeat,
              event_id: data.event_id,
              exception_type: data.exception_type,
              editable: data.editable,
              persisted: data.persisted,
              name_place: data.name_place,
              place_id: data.place_id,
              isGoogleEvent: false
            }
          });
          callback(events);
        }
      });
    },
    eventRender: function(event, element) {
      var isOldEvent = event.allDay && event.start.isBefore(new Date(), 'day');
      var isEndOfEvent = event.end && event.end.isBefore(new Date())

      if(isOldEvent || isEndOfEvent) {
        $(element).addClass('before-current');
      }
    },
    eventClick: function(event, jsEvent, view) {
      localStorage.setItem('current_event', event)
      if(event.title) {
        initDialogEventClick(event, jsEvent);
      } else {
        dialogCordinate(jsEvent, 'new-event-dialog', 'prong');
        showDialog('new-event-dialog');
        $('#event-title').focus();
      }
    },
    dayClick: function(date, jsEvent, view) {
      date_start = moment(date.format()).startOf('day')
      date_end = moment(date.format()).endOf('day');

      setDateTime(date_start, date_end);
      initDialogCreateEvent(date_start, date_end, true);
      dialogCordinate(jsEvent, 'new-event-dialog', 'prong');
      hiddenDialog('popup');
      showDialog('new-event-dialog');
    },
    select: function(start, end, jsEvent) {
      var end_date = moment(end.format()).format(day_format);
      var start_date = moment(start.format()).format(day_format);

      if(end_date !== start_date) {
        $calendar.fullCalendar('unselect');
      } else {
        setDateTime(moment(start.format()), moment(end.format()));
        initDialogCreateEvent(moment(start.format()), moment(end.format()), false);
        dialogCordinate(jsEvent, 'new-event-dialog', 'prong');
        hiddenDialog('popup');
        showDialog('new-event-dialog');
      }
    },
    eventResizeStart: function( event, jsEvent, ui, view ) {
      hiddenDialog('new-event-dialog');
      hiddenDialog('popup');
      setDateTime(event.start, event.end);
    },
    eventResize: function(event, delta, revertFunc) {
      if(event.end.format(day_format) == event.start.format(day_format)) {
        if (event.repeat_type == null || event.repeat_type.length == 0 ||
          event.exception_type == 'edit_only') {
          if (event.exception_type != null)
            exception_type = event.exception_type;
          else
            exception_type = null;
          updateServerEvent(event, 0, exception_type, 0);
        } else {
          end_date = event.end;
          event.end = finish_date;
          confirm_update_popup(event, 0, end_date);
        }
      }else {
        event.end = finish_date;
        alert(I18n.t('events.flashs.not_updated'));
      }
      hiddenDialog('new-event-dialog');
      hiddenDialog('popup');
    },
    eventDragStart: function(event, jsEvent, ui, view) {
      hiddenDialog('new-event-dialog');
      hiddenDialog('popup');
      setDateTime(event.start, event.end);
    },
    eventDrop: function(event, delta, revertFunc) {
      updateServerEvent(event, event.allDay, null, 1);
    },
    // eventOverlap: function(stillEvent, movingEvent) {
    //   // Handle code is here
    //   // return stillEvent.allDay && movingEvent.allDay;
    // },
    loading: function(bool) {
      $('#loading').toggle(bool);
    }
  });

  function initDialogEventClick(event, jsEvent){
    if ($('#popup').length > 0)
      $('#popup').remove();

    hiddenDialog('new-event-dialog');
    hiddenDialog('google-event-popup');
    unSelectCalendar();

    if (event.isGoogleEvent) {
      updateGoogleEventPopupData(event);
      dialogCordinate(jsEvent, 'google-event-popup', 'gprong-popup');
      showDialog('google-event-popup');
    } else {
      $.ajax({
        url: 'events/' + event.event_id,
        data: {
          start: event.start.format('MM-DD-YYYY H:mm A'),
          end: (event.end !== null) ? event.end.format('MM-DD-YYYY H:mm A') : '',
        },
        success: function(data){
          $calContent.append(data);
          dialogCordinate(jsEvent, 'popup', 'prong-popup');
          showDialog('popup');
          deleteEventPopup(event);
          if (event.editable) clickEditTitle(event);
          cancelPopupEvent(event);
        }
      });
    }
  }

  function clickEditTitle(event) {
    var titleInput = $('#title-input-popup');
    $('#title-popup').click(function() {
      $('.data-display').css('display', 'none');
      $('.data-none-display').css('display', 'inline-block');
      titleInput.val(event.summary);
      titleInput.unbind('change');
      titleInput.on('change', function(e) {
        event.summary = e.target.value;
      });
      updateEventPopup(event);
    });
  }

  function updateEventPopup(event) {
    $('#btn-save-event').unbind('click');
    $('#btn-save-event').click(function() {
      hiddenDialog('popup');
      if (event.repeat_type === null || event.repeat_type.length === 0 || event.exception_type === 'edit_only') {
        if (event.exception_type !== null)
          exception_type = event.exception_type;
        else
          exception_type = null;
        updateServerEvent(event, event.allDay, exception_type, 0);
      } else {
        confirm_update_popup(event, event.allDay, event.end);
      }
    });
  }

  function deleteEventPopup(event) {
    $('#btn-delete-event').unbind('click');
    $('#btn-delete-event').click(function() {
      hiddenDialog('popup');
      if (event.repeat_type == null || event.repeat_type.length == 0) {
        deleteEvent(event, 'delete_all');
      } else if (event.exception_type == 'edit_only') {
        deleteEvent(event, 'delete_only');
      } else {
        confirm_repeat_popup(event);
      }
    });
  }

  function deleteEvent(event, exception_type) {
    var start_date_before_delete, finish_date_before_delete;
    if (!event.allDay) finish_date_before_delete = event.end._i;
    start_date_before_delete = event.start._i;
    $.ajax({
      url: '/events/' + event.event_id,
      type: 'DELETE',
      data: {
        exception_type: exception_type,
        exception_time: event.start.format(),
        finish_date: (event.end !== null) ? event.end.format('MM-DD-YYYY H:mm A') : '',
        start_date_before_delete: start_date_before_delete,
        finish_date_before_delete: finish_date_before_delete,
        persisted: event.persisted ? 1 : 0
      },
      dataType: 'json',
      success: function(text){
        var _event = event;
        var count = 0;
        if(exception_type === 'delete_all_follow')
          $calendar.fullCalendar('removeEvents', function(e){
            if(e.event_id === event.event_id && e.start.format() >= event.start.format())
              return true;
          });
        else
          if(exception_type === 'delete_all'){
            $calendar.fullCalendar('removeEvents', function(e){
              if(e.event_id === event.event_id)
                return true;
            });
          } else {
            event.exception_type = exception_type;
          }
        $calendar.fullCalendar('refetchEvents');
      },
      error: function(text) {
      }
    });
  }

  function confirm_repeat_popup(event){
    var dialog = $('#dialog-repeat-popup');
    var dialogW = $(dialog).width();
    var dialogH = $(dialog).height();
    var windowW = $(window).width();
    var windowH = $(window).height();
    var xCordinate, yCordinate;
    xCordinate = (windowW - dialogW) / 2;
    yCordinate = (windowH - dialogH) / 2;
    dialog.css({'top': yCordinate, 'left': xCordinate});
    showDialog('dialog-repeat-popup');

    $('.btn-confirm').click(function() {
      if ($(this).attr('rel') != null){
        var check_is_delete = $(this).attr('rel').indexOf(I18n.t('events.repeat_dialog.delete.delete'));
        if (check_is_delete != -1){
          $('.btn-confirm').unbind('click');
          deleteEvent(event, $(this).attr('rel'));
          hiddenDialog('dialog-repeat-popup');
        }
      }
    });
  }

  function cancelPopupEvent(event){
    $calContent.on('click', '.cancel-popup-event', function() {
      event.title = $('#title-popup').text().trim();
      hiddenDialog('popup');
      hiddenDialog('dialog-repeat-popup');
      hiddenDialog('dialog-update-popup');
    });
  }

  function updateServerEvent(event, allDay, exception_type, is_drop) {
    // setDateTime(event.start, event.end ? event.end : event.start);

    var start_time_before_drag;
    var finish_time_before_drag;
    var start_time = start_date || event.start;
    var end_time = finish_date || event.end;

    if(event.title.length === 0) event.title = I18n.t('calendars.events.no_title');

    if (!event.end && event.allDay) {
      start_date = moment(start_date).startOf('day');
      finish_date = start_date.endOf('day');
    } else {
      finish_date = moment(start_date).add(2, 'hours');
    }

    finish_time_before_drag = moment(end_time.format()).format()
    start_time_before_drag = moment(start_time.format()).format();

    var dataUpdate = {
      event: {
        title: event.summary,
        start_date: moment(event.start).subtract(timezoneCurrentUser, 'hours').format(),
        finish_date: moment(event.end).subtract(timezoneCurrentUser, 'hours').format(),
        all_day: allDay,
        exception_type: exception_type,
        end_repeat: event.end_repeat,
        name_place: event.name_place,
        place_id: event.place_id,
      },
      persisted: event.persisted ? 1 : 0,
      is_drop: is_drop,
      start_time_before_drag: start_time_before_drag,
      finish_time_before_drag: finish_time_before_drag
    }

    $.ajax({
      url: '/events/' + event.event_id,
      data: dataUpdate,
      type: 'PATCH',
      dataType: 'json',
      success: function(data) {
        if (exception_type == 'edit_all_follow' || exception_type == 'edit_all') {
          $calendar.fullCalendar('refetchEvents');
        } else {
          event.event_id = data.id;
          event.exception_type = data.exception_type;
          $calendar.fullCalendar('updateEvent', event);
          $calendar.fullCalendar('renderEvent', event, true);
          $calendar.fullCalendar('refetchEvents');
          $calendar.fullCalendar('rerenderEvents');
        }
      },
      error: function(data) {
        if (data.status == 422) {
          $('#dialog_overlap').dialog({
            autoOpen: false,
            modal: true
          });
          $('#dialog_overlap').dialog({
            buttons : {
              'Confirm' : function() {
                dataUpdate.allow_overlap = "true";
                $.ajax({
                  type: 'PATCH',
                  url: '/events/' + event.event_id,
                  dataType: 'json',
                  data: dataUpdate,
                  success: function(data) {
                    $('#dialog_overlap').dialog('close');
                  }
                });
              },
              'Cancel' : function() {
                $(this).dialog('close');
                event.start = start_time;
                event.end = end_time;
                $calendar.fullCalendar('renderEvent', event, true);
                $calendar.fullCalendar('refetchEvents');
                $calendar.fullCalendar('rerenderEvents');
              }
            }
          });
          $('#dialog_overlap').dialog('open');
        }
      }
    });
  }

  function confirm_update_popup(event, allDay, end_date){
    var dialog = $('#dialog-update-popup');
    var dialogW = $(dialog).width();
    var dialogH = $(dialog).height();
    var windowW = $(window).width();
    var windowH = $(window).height();
    var xCordinate, yCordinate;
    xCordinate = (windowW - dialogW) / 2;
    yCordinate = (windowH - dialogH) / 2;
    dialog.css({'top': yCordinate, 'left': xCordinate});
    showDialog('dialog-update-popup');
    $('.btn-confirm').unbind('click');
    $('.btn-confirm').click(function() {
      if ($(this).attr('rel') != null) {
        var check_is_edit = $(this).attr('rel').indexOf(I18n.t('events.repeat_dialog.edit.edit'));
        if (check_is_edit != -1) {
          event.end = end_date;
          updateServerEvent(event, allDay, $(this).attr('rel'), 0);
          hiddenDialog('dialog-update-popup');
        }
      }
    });
  }

  function saveLastestView() {
    localStorage.setItem('lastestView', $calendar.fullCalendar('getView').type);
  }

  $(document).click(function() {
    if ($('.fc-view-container').length !== 0)
      saveLastestView();

    if (!$(event.target).hasClass('create') && !$(event.target).closest('#event-popup').hasClass('dropdown-menu')) {
      $('#source-popup').removeClass('open');
    }

    if ($(event.target).closest('#new-event-dialog').length === 0 && $(event.target).closest('.fc-body').length === 0) {
      hiddenDialog('new-event-dialog');
      unSelectCalendar();
    }

    if ($(event.target).closest('#popup').length === 0 && $(event.target).closest('.fc-body').length == 0) {
      hiddenDialog('popup');
    }

    if ($(event.target).closest('#dialog-repeat-popup').length === 0 && $(event.target).closest('#btn-delete-event').length === 0) {
      hiddenDialog('dialog-repeat-popup');
    }

    if($(event.target).closest('.fc-event').length === 0 && $(event.target).closest('#google-event-popup').length === 0) {
      hiddenDialog('google-event-popup');
    }
  });

  $calendar.bind(mousewheelEvent, function(e) {
    var view = $calendar.fullCalendar('getView');
    var event = window.event || e;
    delta = event.detail ? event.detail*(-120) : event.wheelDelta;
    if(mousewheelEvent === "DOMMouseScroll"){
      delta = event.originalEvent.detail ? event.originalEvent.detail*(-120) : event.wheelDelta;
    }
    if (view.name === 'month') {
      if(delta > 60) {
        $calendar.fullCalendar('next');
      } else{
        $calendar.fullCalendar('prev');
      };
      var moment = $calendar.fullCalendar('getDate');
      $('#mini-calendar').datepicker();
      $('#mini-calendar').datepicker('setDate', new Date(moment.format('MM/DD/YYYY')));
    };
  });

  $('.disable').addClass('disable-on');

  $calContent.on('click', '.btn-cancel, .bubble-close', function(){
    unSelectCalendar();
    hiddenDialog('new-event-dialog');
    hiddenDialog('dialog-update-popup');
    hiddenDialog('dialog-repeat-popup');
    hiddenDialog('google-event-popup');
  })

  function dialogCordinate(jsEvent, dialogId, prongId) {
    var dialog = $('#' + dialogId);
    var dialogW = $(dialog).width();
    var dialogH = $(dialog).height();
    var windowW = $(window).width();
    var windowH = $(window).height();
    var xCordinate, yCordinate;
    var prongRotateX, prongXCordinate, prongYCordinate;

    if(jsEvent.clientX - dialogW/2 < 0) {
      xCordinate = jsEvent.clientX - dialogW/2;
    } else if(windowW - jsEvent.clientX < dialogW/2) {
      xCordinate = windowW - 2 * dialogW/2 - 10;
    } else {
      xCordinate = jsEvent.clientX - dialogW/2;
    }
    if(xCordinate < 0) xCordinate = 10;

    if(jsEvent.clientY - dialogH < 0) {
      yCordinate = jsEvent.clientY + 20;
      prongRotateX = 180;
      prongYCordinate = -9;
    } else {
      yCordinate = jsEvent.clientY - dialogH - 20;
      prongRotateX = 0;
      prongYCordinate = dialogH;
    }

    prongXCordinate = jsEvent.clientX - xCordinate - 10;

    $(dialog).css({'top': yCordinate, 'left': xCordinate});
    $('#' + prongId).css({
      'top': prongYCordinate,
      'left': prongXCordinate,
      'transform': 'rotateX(' + prongRotateX + 'deg)'
    });
  }

  function initDialogCreateEvent(start, end, dayClick) {
    var title = $('#event-title');
    title.focus().val('');
    var isAllDay = !start._i;

    $('#all-day').val(dayClick || isAllDay ? '1' : '0');
    $('.event-time').text(eventDateTimeFormat(start, end, dayClick || isAllDay));

    // set hidden field value
    $('#start-time').val(dateTimeFormat(start, dayClick));
    $('#finish-time').val(dateTimeFormat(end, dayClick));
  }

  function updateGoogleEventPopupData(event) {
    $('#gtitle-popup span').html(event.title);
    $('#gevent-btn').attr('href', event.link);
    $('#gtime-event-popup').html(event.start.format('MM-D-YYYY h:mm a') + ' TO ' + event.end.format('MM-D-YYYY h:mm a'));
    $('#gcalendar-event-popup').html(event.orgnaizer);
  }

  function showDialog(dialogId) {
    var dialog = $('#' + dialogId);
    $(dialog).removeClass('dialog-hidden');
    $(dialog).addClass('dialog-visible');
    $('#event-title').focus();
  }

  hiddenDialog = function(dialogId) {
    var dialog = $('#' + dialogId);
    $(dialog).addClass('dialog-hidden');
    $(dialog).removeClass('dialog-visible');
  }

  function unSelectCalendar() {
    $calendar.fullCalendar('unselect');
  }

  $('#new-event-btn').on('click', function(event) {
    event.preventDefault();
    var form = $('#new_event');
    $.ajax({
      url: $(form).attr('action'),
      type: 'POST',
      dataType: 'script',
      data: $(form).serialize(),
      success: function(data) {}
    });
  });

  $('#edit-event-btn').on('click', function(event) {
    event.preventDefault();
    var form =  $('#new_event');
    var url = $(form).attr('action') + '/new';

    obj = Object();
    var data = $(form).serializeArray();
    $.each(data, function(_, element) {
      if(element.name.indexOf('start_date') > 0) {
        obj['start_date'] = moment.utc(element.value, I18n.t('events.time.formats.time_format_part')).utcOffset(timezoneCurrentUser * 60)._d
      } else if(element.name.indexOf('finish_date') > 0) {
        obj['finish_date'] = moment.utc(element.value, I18n.t('events.time.formats.time_format_part')).utcOffset(timezoneCurrentUser * 60)._d
      } else if(element.name.indexOf('all_day') > 0) {
        obj['all_day'] = element.value
      } else if(element.name.indexOf('title') > 0) {
        obj['title'] = element.value
      } else if(element.name.indexOf('calendar_id') > 0) {
        obj['calendar_id'] = element.value
      } else if(element.name.indexOf('name_place') > 0) {
        obj['name_place'] = element.value
      } else if(element.name.indexOf('place_id') > 0) {
        obj['place_id'] = element.value
      }
    });

    content = JSON.stringify({event: obj})

    window.location.href = url + '?fdata='+ Base64.encode(content);
  });

  $('#event-title').click(function(event) {
    $('.error-title').text('');
  });

  function setDateTime(start, end) {
    start_date = start;
    finish_date = end;
  }

  function eventDateTimeFormat(startDate, finishDate, dayClick) {
    if (dayClick || finishDate == null) {
      return startDate.format('MMMM Do YYYY');
    } else {
      return startDate.format('dddd') + ' ' + startDate.format('H:mm A') + ' To '
        + finishDate.format('H:mm A') + ' ' + finishDate.format('DD-MM-YYYY');
    }
  }

  function dateTimeFormat(dateTime, dayClick) {
    if(dayClick)
      return moment.utc(dateTime).format('MMMM Do YYYY, HH:mm:ss');

    return moment.utc(dateTime).format('MMMM Do YYYY, h:mm:ss a');
  }

  $('.calendar-checkbox').change(function(event) {
    if (this.checked) {
      $calendar.fullCalendar('addEventSource', $(this).attr('google_calendar_id'));
    } else {
      $calendar.fullCalendar('removeEventSource', $(this).attr('google_calendar_id'));
    }

    $calendar.fullCalendar('removeEvents');
    $calendar.fullCalendar('refetchEvents');
  });

  if ($('#make_public').val() === 'public_hide_detail') {
    $('#make_public').prop('checked', true);
    $('#free_busy').prop('checked', true);
  } else if ($('#make_public').val() === 'share_public') {
    $('#make_public').prop('checked', true);
  } else if ($('#make_public').val() === 'no_public') {
    $('#make_public').prop('checked', false);
    $('#free_busy').prop('disabled', true);
  };

  $('#make_public').click(function() {
    $('#make_public').val((this.checked) ? 'share_public' : 'no_public');
    $('#free_busy').prop('disabled', (this.checked) ? false : true);
  });

  $('#free_busy').click(function() {
    $('#make_public').val(($('#free_busy').prop('checked')) ? 'public_hide_detail' : 'share_public');
  });

  /* share-calendar*/

  $('#textbox-email-share').select2({
    tokenSeparators: [',', ' '],
    width: '90%'
  });

  var current_user = $('#current_user').val();
  var user_ids = [current_user];

  $('.user_share_ids').each(function() {
    user_id_temp = $(this).val();
    if ($.inArray(user_id_temp, user_ids) == -1) {
      user_ids.push(user_id_temp);
    };
  });

  $('#add-person').click(function() {
    var user_id = $('#textbox-email-share').val();
    var email = $('#textbox-email-share').find('option:selected').text();
    var permission = $('#permission-select').val();
    var color_id = $('#calendar_color_id').val();
    if (user_id) {
      $.ajax({
        url: '/calendars/new',
        method: 'get',
        data: {
          user_id: user_id,
          email: email,
          permission: permission,
          color_id: color_id
        },
        success: function(html) {
          if ($.inArray(user_id, user_ids) == -1) {
            if($('#user-calendar-share-' + user_id).length > 0) {
              $('#user-calendar-share-' + user_id).css('display', 'block');
              $('#user-calendar-share-' + user_id).find('.user_calendar_destroy').val(false);
              per_id_new = $('#permission-select').val();
              $('#user-calendar-share-' + user_id).find('.permission-select').val(per_id_new);
            } else {
              $('#list-share-calendar').append(html);
              $('#user-calendar-share-' + user_id).find('.permission-select').select2({
                tags: true,
                minimumResultsForSearch: Infinity
              });
              user_ids.push(user_id);
            }
          };
        }
      });
    }
    $('#textbox-email-share').val('');
    $('#select2-textbox-email-share-container').html('');
  });

  $('#list-share-calendar').on('click', '.image-remove', function() {
    $(this).parent().parent().find('.user_calendar_destroy').val('1');
    $(this).parent().parent().hide();
    index = user_ids.indexOf($(this).prop('id'));
    if (index !== -1)
      user_ids.splice(index, 1);
  });

  $('#request-email-button').click(function() {
    var email = $('#request-email-input').val();
    if (email === "") {
      alert('Please add email to request!');
    } else {
      $.ajax({
        url: '/request_emails/new',
        data: {request_email: email},
        type: 'GET',
        dataType: 'text',
        success: function(text) {
          alert(text);
        }
      });
    }

  });

  $('#add-attendee').on('click', function() {
    id = $('#list-attendee').find('li').length;
    attendee = $('#load-attendee').val();
    exitEmail(attendee);
    if (validateEmail(attendee)){
      list_attendee = document.getElementById('list-attendee');
      if(!exitEmail(attendee)){
        var attendee_form = $('#group_attendee_'+(id-1)).clone()[0];

        var group_attendee = $('#group_attendee_'+(id-1));

        $(group_attendee).find('li')[0].innerHTML = attendee;
        $(group_attendee).find('input[type=hidden]')[0].value = attendee;
        $(group_attendee).find('input[type=hidden]')[1].value = false;
        $(group_attendee).find('input[type=hidden]')[2].value = $('#load-attendee').attr('data-user-id');
        $(group_attendee).show();

        attendee_form.id = 'group_attendee_'+id;
        $(attendee_form).find('input[type=hidden]')[0].name = 'event[attendees_attributes]['+id+'][email]';
        $(attendee_form).find('input[type=hidden]')[1].name = 'event[attendees_attributes]['+id+'][_destroy]';
        $(attendee_form).find('input[type=hidden]')[2].name = 'event[attendees_attributes]['+id+'][user_id]';
        $(attendee_form).find('input[type=hidden]')[1].value = true

        list_attendee.appendChild(attendee_form);
        $('#load-attendee').val('');
        $('#load-attendee').focus();
      }else {
        alert(I18n.t('events.flashs.attendee_added'));
      }
    }else {
      alert(I18n.t('events.flashs.invalid_email'));
    }
  });

  $('#load-attendee').autocomplete({
    source: '/search',
    create: function(){
      $(this).data('ui-autocomplete')._renderItem = function(ul, item){
        return $('<li>')
          .append('<a class="selected-item" data-id='+item.user_id+'>' + item.email + '</a>')
          .appendTo(ul);
      };
    }
  });

  $(document).on('click', '.selected-item', function(){
    $('#load-attendee').val($(this).text());
    $('#load-attendee').attr('data-user-id', $(this).data('id'));
  });

  $('#list-attendee').on('click', '.remove_attendee', function(event){
    $($(this).parent().find('input[type=hidden]')[1]).val(true)
    $(this).parent().hide();
  });

  $('.calendar-address').on('click', function() {
    $('.cal-dialog').css('display', 'block');
  });

  $('.cal-dialog-title-close, .goog-buttonset-default').on('click', function() {
    $('.cal-dialog').css('display', 'none');
  });

  $(document).on('click', '.btn-confirmation-repeat', function() {
    var current_event = localStorage.getItem('current_event');
    var allDay = current_event.allDay;
    confirm_update_popup(current_event, allDay, current_event.end);
  });
});

function validateEmail(email) {
  var email = document.getElementById('load-attendee')
  var re = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(email.value)) {
    return false;
  }
  return true;
}

function exitEmail(email) {
  for(var i = 0; i < $('#list-attendee').find('li').length; i++){
    if(email == $('#list-attendee').find('li')[i].innerHTML
      && $($('#list-attendee').find('li')[i]).parent().find('input[type=hidden]')[1].value == 'false'){
      return true;
    }
  };
  return false;
}
