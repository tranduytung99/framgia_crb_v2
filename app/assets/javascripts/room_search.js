$(document).on('ready', function(){
  $('.room-search-submit').click(function (event) {
    event.preventDefault();
    var timezoneName = $('#timezone').data('name');
    var start_date = $('#start_date_time').val();
    var finish_date = $('#finish_date_time').val();
    var start_time = $('#start_time').val();
    var finish_time = $('#finish_time').val();
    var authenticity_token = $('#authenticity_token').val();

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

    var start_in_time_zone = moment.tz(start_datetime, 'DD-MM-YYYY hh:mma', timezoneName).format();
    var finish_in_time_zone = moment.tz(finish_datetime, 'DD-MM-YYYY hh:mma', timezoneName).format();

    $.ajax({
      url: '/room_search',
      dataType: "json",
      data: {
        start_time: start_in_time_zone,
        finish_time: finish_in_time_zone
      },
      renderResult: function(data){
        var dataArr = data.results;

        if (dataArr.length <= 0){
          return '<div class="alert alert-info">\
              <strong>' + I18n.t('room_search.dont_have_empty_room') + '</strong>\
            </div>';
        }

        var start_time = moment(start_in_time_zone, 'YYYY/MM/DD HH:mm:ss ZZ').tz(timezoneName).format('h:mm a');
        var finish_time = moment(finish_in_time_zone, 'YYYY/MM/DD HH:mm:ss ZZ').tz(timezoneName).format('h:mm a');
        var date_time = moment(start_in_time_zone, 'YYYY/MM/DD HH:mm:ss ZZ').tz(timezoneName).format('DD-MM-YYYY');

        var html = '<table class="table table-striped">';
        html += '<tr>';
        html += '<th>' + I18n.t('room_search.room_name') + '</th>';
        html += '<th>' + I18n.t('room_search.date') + '</th>';
        html += '<th>' + I18n.t('room_search.time') + '</th>';
        html += '<th>' + I18n.t('room_search.action') + '</th>';
        html += '</tr>';
        for (var i = 0; i < dataArr.length; i++){
          html += '<tr>';
          html += '<td>'+ dataArr[i].name +'</td>';
          html += '<td>'+ date_time +'</td>';
          html += '<td>'+ start_time + ' - ' + finish_time +'</td>';
          html += '<td>';
          html += '<form action="/events" method="post">';
          html += '<input type="hidden" name="authenticity_token" id="authenticity_token" '
            + 'value="' + authenticity_token + '">';
          html += '<input type="hidden" name="event[title]" value="New event"/>';
          html += '<input type="hidden" name="event[start_date]" value="' + start_in_time_zone + '"/>';
          html += '<input type="hidden" name="event[finish_date]" value="' + finish_in_time_zone + '"/>';
          html += '<input type="hidden" name="event[all_day]" value="0"/>';
          html += '<input type="hidden" name="event[name_place]" value=""/>';
          html += '<input type="hidden" name="event[allow_overlap]" value="true"/>';
          html += '<input type="hidden" name="event[calendar_id]" value="' + dataArr[i].id + '"/>';
          html += '<input type="submit" class="btn btn-success btn-sm book-room-submit" value="Book" />';
          html += '</form>';
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

  $('body').on('click', '.book-room-submit', function(){
    if (confirm(I18n.t('room_search.confirm_create_event')) == false) {
      return false;
    }
  });
});
