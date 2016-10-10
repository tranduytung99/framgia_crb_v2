$(document).on('page:change', function() {
  var modal1 = $("#Modal-signin");
  var modal2 = $("#Modal-signup");
  var btn1 = $("li.login");
  var btn2 = $("li.signup");
  var span = $(".close");

  btn1.on('click', function() {
    modal1.css('display', 'block');
  });
  btn2.on('click', function() {
    modal2.css('display', 'block');
  });

  span.on('click', function() {
    modal.css('display', 'none');
  });

  $("#Modal-signup").click(function(e) {
        e.stopPropagation();
        $(this).fadeOut(300);
  });
  $("#Modal-signin").click(function(e) {
        e.stopPropagation();
        $(this).fadeOut(300);
  });
});
