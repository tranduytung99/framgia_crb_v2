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

  $('.add-new-organization').click(function (event) {
    event.preventDefault();
    event.stopPropagation();
    $('#add-org-modal').css('display', 'block');
    $('#btn-add').off('click').on('click', function () {
      var form = $('#new_organization');
      $.ajax({
        url: form.attr('action'),
        type: 'POST',
        data: form.serialize(),
        success: function(data) {
          if(data.indexOf('org-item')>0){
            alert(I18n.t('organizations.organization.create_success'));
            $('.org-body').empty().append(data);
            $('#new_organization').find('.form-group #organization_name').val('');
            $('#add-org-modal').fadeOut(300);
          } else {
            alert(I18n.t('organizations.organization.create_fail'));
            $('.signin_error_message').html(data);
          }
        }
      });
      return false;
    });
    $('.close').on('click', function() {
      $('#add-org-modal').fadeOut(300);
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
