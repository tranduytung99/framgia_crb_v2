$(document).on('page:change', function() {
  $('.update').click(function(event) {
    event.preventDefault();
    var id = $(this).attr('id');
    $('#edit-'+ id).css('display', 'block');
    $('#update_' + id).on('click', function() {
      update_org(id);
      $('#edit-'+ id).fadeOut(300);
      return false;
    });

    $('#update_team_' + id).on('click', function() {
      update_team(id);
      $('#edit-'+ id).fadeOut(300);
      return false;
    });
    $('.close').on('click', function() {
      $('#edit-'+ id).fadeOut(300);
    });
  });

  function update_org(id){
    form = $('#edit_organization_'+id);
    $.ajax({
      url: form.attr('action'),
      type: 'PUT',
      data: form.serialize(),
      success: function(data) {
        alert(I18n.t('organizations.organization.updated'));
        $('#name_'+id).text(data.name);
      }
    });
  }

  function update_team(id){
    form = $('#edit_team_'+id);
    $.ajax({
      url: form.attr('action'),
      type: 'PUT',
      data: form.serialize(),
      success: function(data) {
        alert(I18n.t('teams.update.updated'));
        $('#team_'+id).text(data.name);
      },
      error: function(text) {
        console.log(text);
      }
    });
  }
});
