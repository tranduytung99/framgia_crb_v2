$(document).on("ready", function() {
  // var place_names = localStorage.getItem('place_names');

  // if (place_names === null) {
    localStorage.removeItem('place_names');
    place_names = $('#places ul .divBox > div').map(function() {return $(this).data('place-name').toLowerCase()});
  // } else {
  //   place_names = place_names.split(',');
  // }

  $('#places').on('click', '.divBox', function() {
    $('div', this).hasClass('color-' + $(this).data('color-id'))
    var item = $('div.f-inline-block.ccp-rb-color', this);
    var place_name = item.data('place-name').toLowerCase();

    if(item.hasClass('uncheck')) {
      item.removeClass('uncheck');
      place_names.push(place_name);
    } else {
      item.addClass('uncheck');
      place_names = $.grep(place_names, function(value) {
        return value != place_name;
      });
    }

    $calendar.fullCalendar('clientEvents', function(event) {
      if((event.name_place !== null && event.name_place.length > 0 && $.inArray(event.name_place.toLowerCase(), place_names) === -1) || !existPlaceName(place_names, event.title.toLowerCase())) {
        $('.' + event.id).hide();
      } else {
        $('.' + event.id).show();
      }
    });

    localStorage.setItem('place_names', place_names);
  })

  existPlaceName = function(place_names, event_title) {
    var existed = false;
    place_names.forEach( function(element, index) {
      if(event_title.indexOf(element) >= 0) {
        existed = true;
        return;
      }
    });

    return existed;
  };
})
