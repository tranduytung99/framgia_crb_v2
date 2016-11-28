$(document).on("page:change", function() {
  var place_ids = localStorage.getItem('place_ids');

  if (place_ids === null) {
    place_ids = [];
  } else {
    place_ids = place_ids.split(',').map(Number);
  }

  $('#places').on('click', '.divBox', function() {
    $('div', this).hasClass('color-' + $(this).data('color-id'))
    var item = $('div.f-inline-block.ccp-rb-color', this);
    var place_id = item.data('place-id');

    if(item.hasClass('uncheck')) {
      item.removeClass('uncheck');
      place_ids.push(place_id);
    } else {
      item.addClass('uncheck');
      place_ids = $.grep(place_ids, function(value) {
        return value != place_id;
      });
    }

    $calendar.fullCalendar('clientEvents', function(event){
      if($.inArray(event.place_id, place_ids) === -1) {
        $('.' + event.id).hide();
      } else {
        $('.' + event.id).show();
      }
    });

    localStorage.setItem('place_ids', place_ids);
  })
})
