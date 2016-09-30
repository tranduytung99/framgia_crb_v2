$(document).on('page:change', function() {
  $slider = $('#slider');
  $slider.height($(window).height() - 44);

  var ul = $("#slider ul");
  var slide_count = ul.children().length;
  var slide_width_pc = 100.0 / slide_count;
  var slide_index = 0;

  ul.find("li").each(function(indx) {
    var left_percent = (slide_width_pc * indx) + "%";
    $(this).css({"left":left_percent});
    $(this).css({width:(100 / slide_count) + "%"});
  });

  $("#slider .prev").click(function() {
    if (slide_index == 0){
      slide_index = slide_count ;
    }
    slide(slide_index - 1);
  });

  $("#slider .next").click(function() {
    if (slide_index == (slide_count-1)){
      slide_index = -1 ;
    }
    slide(slide_index + 1);
  });

  function slide(new_slide_index) {
    var margin_left_pc = (new_slide_index * (-100)) + "%";

    ul.animate({"margin-left": margin_left_pc}, 700, function() {
      slide_index = new_slide_index
    });
  }

  var timerId = setInterval(function(){ $("#slider .next").trigger('click') }, 3000);

  $('#slider')
    .mouseenter(function() {
      clearInterval(timerId);
    })
    .mouseleave(function() {
      timerId = setInterval(function(){ $("#slider .next").trigger('click') }, 3000);
    });
});
