function load_ajax(){
  $.ajax({
    url : "/load",
    type : "post",
    dateType:"text",
    data : {
      email : $('#search-user').val(),
      organ_slug : $('#organ_slug').val()
    },
    success : function (result){
      $('#result').html(result);
    }
  });
}
