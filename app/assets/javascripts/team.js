$(document).on('page:change',function () {
  $('#teams-list').on('click', '.rm-team', function (e){
    e.preventDefault();
    var id = $(this).attr('id');
    var org_id = $(this).attr('data-organization');
    swal({
      title: I18n.t('organizations.organization_teams.delete_confirmation'),
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
        url: '/organizations/' + org_id + '/teams/' + id,
        method: 'DELETE',
        success: function (response) {
          swal('Deleted!', I18n.t('organizations.organization_teams.delete_success'), 'success');
          if(response.indexOf('error_explanation') <= 0){
            $('#teams-list').find('li').remove();
            $('#teams-list').append(response);
          } else {
            $('.main-content').prepend(response);
          }
        },
        error: function () {
          swal('Failed!', I18n.t('organizations.organization_teams.delete_failed'), 'error');
        }
      });
    }, function (dismiss) {
      // dismiss can be 'cancel', 'overlay',
      // 'close', and 'timer'
      if (dismiss === 'cancel') {
        swal(
          I18n.t('cancelled'),
          I18n.t('safe')+' :)',
          'error'
        )
      }
    })
  })
});
