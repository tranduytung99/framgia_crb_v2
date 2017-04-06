$(document).on('ready', function() {
  var modal1 = $('#modal-signin');
  var modal2 = $('#modal-signup');
  var btn1 = $('.login');
  var btn2 = $('.signup');
  var btn3 = $('.edit');
  var span = $('.close');

  btn1.on('click', function() {
    modal1.css('display', 'block');
    modal2.css('display', 'none');
  });

  btn2.on('click', function() {
    modal2.css('display', 'block');
    modal1.css('display', 'none');
  });

  btn3.on('click', function() {
    modal3.css('display', 'block');
  });

  span.on('click', function() {
    modal1.fadeOut(300);
    modal2.fadeOut(300);
  });
});
