$(document).on('ready', function(){
  if ($('.room-search-submit').length == 0) {
    return;
  }

  $('.room-search-submit').click(function (event) {
    event.preventDefault();
    var timezoneName = $('#timezone').data('name');
    var start_date = $('#start_date_time').val();
    var finish_date = $('#finish_date_time').val();
    var start_time = $('#start_time').val();
    var finish_time = $('#finish_time').val();
    var calendar_ids = $('#calendar_ids').val();
    var number_of_seats = $('#number_of_seats').val();
    if (start_date == null || start_date == ''){
      $('.result').html('<div class="alert alert-danger">' + I18n.t('room_search.empty_start_date_input') + '</div>')
        .appendTo('.result');
      return;
    }
    if (start_time == null || start_time == ''){
      $('.result').html('<div class="alert alert-danger">' + I18n.t('room_search.empty_start_time_input') + '</div>')
        .appendTo('.result');
      return;
    }
    if (finish_time == null || finish_time == ''){
      $('.result').html('<div class="alert alert-danger">' + I18n.t('room_search.empty_finish_time_input') + '</div>')
        .appendTo('.result');
      return;
    }

    var start_datetime = start_date + ' ' + start_time;
    var finish_datetime = finish_date + ' ' + finish_time;
    if (calendar_ids == null){
      calendar_ids_url = "";
    } else {
      calendar_ids_url = new Array();
      for (var i = 0; i < calendar_ids.length; i++) {
        calendar_ids_url.push('calendar_ids' + encodeURIComponent('[]') + '=' + encodeURIComponent(calendar_ids[i]));
      }
      calendar_ids_url = calendar_ids_url.join('&');
    }

    var start_in_time_zone = moment.tz(start_datetime, 'DD-MM-YYYY hh:mma', timezoneName).format();
    var finish_in_time_zone = moment.tz(finish_datetime, 'DD-MM-YYYY hh:mma', timezoneName).format();
    var new_url = '/calendars/search?';
    new_url += 'start_time=' + encodeURIComponent(start_in_time_zone.toString());
    new_url += '&finish_time=' + encodeURIComponent(finish_in_time_zone.toString());
    new_url += '&' + calendar_ids_url;
    new_url += '&number_of_seats=' + encodeURIComponent(number_of_seats.toString());

    history.pushState(null, null, new_url);

    $.ajax({
      url: '/calendars/search',
      dataType: "json",
      data: {
        start_time: start_in_time_zone,
        finish_time: finish_in_time_zone,
        number_of_seats: number_of_seats,
        calendar_ids: calendar_ids
      },
      renderResult: function(data){
        var data_arr = data.results;
        if (data_arr.length <= 0){
          return '<div class="alert alert-info">\
              <strong>' + I18n.t('room_search.dont_have_empty_room') + '</strong>\
            </div>';
        }
        var html = '<table class="table table-striped">';
        html += '<tr>';
        html += '<th>' + I18n.t('room_search.room_name') + '</th>';
        html += '<th>' + I18n.t('room_search.date') + '</th>';
        html += '<th>' + I18n.t('room_search.time') + '</th>';
        html += '<th>' + I18n.t('room_search.action') + '</th>';
        html += '</tr>';
        for (var i = 0; i < data_arr.length; i++){
          var room_name = data_arr[i].room_name;
          var start_event_date = moment(data_arr[i].start_date, 'YYYY/MM/DD HH:mm:ss ZZ')
            .tz(timezoneName).format('DD-MM-YYYY');
          var start_time = moment(data_arr[i].start_date, 'YYYY/MM/DD HH:mm:ss ZZ')
            .tz(timezoneName).format('HH:mm');
          var finish_time = moment(data_arr[i].finish_date, 'YYYY/MM/DD HH:mm:ss ZZ')
            .tz(timezoneName).format('HH:mm');
          var detail_time = start_time + ' - ' + finish_time;

          var event_params = JSON.stringify({
            calendar_id: data_arr[i].calendar.id.toString(),
            start_date: data_arr[i].start_date.toString(),
            finish_date: data_arr[i].finish_date.toString()
          });

          html += '<tr>';
          html += '<td>'+ room_name +'</td>';
          html += '<td>'+ start_event_date +'</td>';
          html += '<td>'+ detail_time +'</td>';
          html += '<td>';
          html += '<a href="/events/new?fdata=' + Base64.encode(event_params) + '" ';
          html += 'class="btn btn-success btn-sm">' + I18n.t('room_search.book') + '</a>';
          html += '</td>';
          html += '</tr>';
        }
        html += '</table>';

        return html;
      },
      success: function(data){
        $('.result').html(this.renderResult(data)).appendTo('.result');
      },
      error: function(xhr, status, error){
        $('.result').html('<div class="alert alert-danger">' + I18n.t('room_search.check_input') + '</div>')
          .appendTo('.result');
      }
    });
  });
});
