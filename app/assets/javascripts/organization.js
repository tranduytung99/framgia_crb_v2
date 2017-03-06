$(document).on('page:change', function() {
  $('.update').on('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    var id = $(this).attr('id');
    $('#edit-'+ id).css('display', 'block');
    $('#update_' + id).off('click').on('click', function() {
      update_org(id);
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
            swal('Created!', I18n.t('organizations.organization.create_success'), 'success');
            $('.org-body').empty().append(data);
            $('#new_organization').find('.form-group #organization_name').val('');
            $('#add-org-modal').fadeOut(300);
          } else {
            swal('Failed!', I18n.t('organizations.organization.create_fail'), 'error');
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
        if(typeof data == 'object'){
          swal('Updated organization!', I18n.t('organizations.update.updated'), 'success');
          $('#name_'+id).text(data.name);
          $('#edit-'+ id).fadeOut(300);
        } else {
          $('.signin_error_message').html(data);
          swal('Failed!', I18n.t('organizations.update.failed'), 'error');
        }
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

  $('#user_ids').select2({
    placeholder: I18n.t('organizations.show.name'),
    allowClear: true
  });

  $('#content').find("[id^='tab']").hide();
  $('#tabs li:first').attr("id","current");
  $('#content #tab1').fadeIn();

  $('#tabs a').click(function(e) {
      e.preventDefault();
      if ($(this).closest("li").attr("id") == "current"){
       return;
      }
      else{
        $('#content').find("[id^='tab']").hide();
        $('#tabs li').attr("id","");
        $(this).parent().attr("id","current");
        $('#' + $(this).attr('name')).fadeIn();
      }
  });

  $('#org-body').on('click', '.rm-org', function (e){
    e.preventDefault();
    var id = $(this).attr('id');
    swal({
      title: I18n.t('organizations.organization.delete_confirm'),
      text: I18n.t('cant_revert'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: I18n.t('confirm_delete'),
      cancelButtonText: I18n.t('cancel_delete'),
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true
    }).then(function () {
      $.ajax({
        url: '/organizations/' + id,
        method: 'DELETE',
        success: function (response) {
          swal('Deleted!', I18n.t('organizations.organization.delete_success'), 'success');
          if(response.indexOf('error_explanation') <= 0){
            $('#org-body').find('.org-item').remove();
            $('#org-body').append(response);
          } else {
            $('.main-content').prepend(response);
          }
        },
        error: function (response) {
          swal(
            I18n.t('organizations.organization.delete_fail'),
            response.responseText,
            'error'
          );
        }
      });
    }, function (dismiss) {
      // dismiss can be 'cancel', 'overlay',
      // 'close', and 'timer'
      if (dismiss === 'cancel') {
        swal(
          I18n.t('cancelled'),
          I18n.t('org_safe')+' :)',
          'error'
        )
      }
    })
  })
});
