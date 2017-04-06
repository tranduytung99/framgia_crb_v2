$(document).on('ready', function() {
  $(document).click(function(event) {
    if (event === undefined) return;
    if ($(event.target).hasClass('clstMenu') || $(event.target).closest('.header-nav-item.dropdown').length > 0) return;

    $('.sub-menu').removeClass('sub-menu-visible');
    $('.sub-menu').addClass('sub-menu-hidden');
  });

  $('.header-nav-item.dropdown').click(function(event) {
    var $subMenu = $('> .sub-menu', $(this).parent());
    $('.sub-menu').not($subMenu).addClass('sub-menu-hidden');

    var position = $(this).offset();
    var right = position.left + $(this).outerWidth() / 2 - 170;

    $subMenu.css({'top': 44, 'left': right});
    $('> .top-prong', $subMenu).css({
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
});
