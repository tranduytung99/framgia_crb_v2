$(document).ready(function(){
  $('.logo-upload').change(function(){
    if (this.files && this.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $('.upload-image .logo-preview')
          .attr('src', e.target.result);
      };

      reader.readAsDataURL(this.files[0]);
    }
  });

  $('a[data-toggle="tab"]').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

  $('a[data-toggle="tab"]').on("shown.bs.tab", function () {
    var id = $(this).attr("href");
    localStorage.setItem('selectedTab', id)
  });

  var selectedTab = localStorage.getItem('selectedTab');
  if (selectedTab !== null) {
    $('a[data-toggle="tab"][href="' + selectedTab + '"]').tab('show');
  }
});
