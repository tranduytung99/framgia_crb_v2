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
