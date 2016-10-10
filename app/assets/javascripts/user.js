function myModal(){
  $('#my-modal')[0].style.display = 'block';
}

function closeModal(){
  $('#my-modal')[0].style.display = 'none';
}

function goBack() {
  window.history.back();
}

$(document).on('page:change', function() {
  var checkbox = [];
  var btn_load = I18n.t('user.info.events.button');

  // $('#load-more-event').click(function() {
  //   $('#load-more-event').html('').addClass('load-gif');
  //   rel =  Number($('#load-more-event').attr('rel')) + 1;
  //   $('#load-more-event').attr('rel', rel);
  //   get_calendar_id();
  //   $.ajax({
  //     url: '/api/events',
  //     data: {
  //       page: rel,
  //       calendar_id: checkbox
  //     },
  //     success: function(html) {
  //       if(html == '')
  //         $('#load-more-event').hide();
  //       else{
  //         $('#load-more-event').removeClass('load-gif').html(btn_load).show();
  //         $('#event-list-id').append(html);
  //       }
  //     },
  //     error: function(html) {
  //       $('#load-more-event').hide();
  //     }
  //   });
  // });

  $('.calendar-checkbox').change(function(event) {
    get_calendar_id();
    $.ajax({
      url: '/api/events',
      data: {
        calendar_id: checkbox,
      },
      success: function(html) {
        $('#event-list-id').html(html);
        $('#load-more-event').attr('rel', 1);
        $('#load-more-event').removeClass('load-gif').html(btn_load).show();
      }
    });
  });

  function get_calendar_id() {
    checkbox = [];
    $('input:checkbox[name=checkbox-calendar]:checked').each(function() {
      checkbox.push($(this).val());
    });
  }

  $(document).click(function() {
    if(event === undefined) return;

    if ($(event.target).closest('#header-avatar').length == 0) {
      $('#sub-menu-setting').removeClass('sub-menu-visible');
      $('#sub-menu-setting').addClass('sub-menu-hidden');
    }
  });

  $('#header-avatar').click(function() {
    var position = $('#header-avatar').offset();
    var $subMenu = $('#sub-menu-setting');

    $subMenu.css({'top': position.top + 44, 'right': 15});
    $('#prong-header').css({
      'top': -9,
      'right': 5,
      'transform': 'rotateX(' + 180 + 'deg)'
    });

    if ($subMenu.hasClass('sub-menu-visible')) {
      $subMenu.removeClass('sub-menu-visible');
      $subMenu.addClass('sub-menu-hidden');
    } else {
      $subMenu.removeClass('sub-menu-hidden');
      $subMenu.addClass('sub-menu-visible');
    };
  });

  $(function () {
    $('#event-list-id li').slice(0, 5).show();
    $('#load-more-event').on('click', function (e) {
      e.preventDefault();
      $('#event-list-id li:hidden').slice(0, 5).slideDown();
      if ($('#event-list-id li:hidden').length == 0) {
        $('#load').fadeOut('slow');
        $('#load-more-event').prop('hidden', true);
      }
      $('html,body').animate({
        scrollTop: $(this).offset().top
      }, 1500);
    });
  });
});
