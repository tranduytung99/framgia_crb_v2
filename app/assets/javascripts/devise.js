$(document).ready(function(){
  Authentication.callbackSubmit();
});

var Authentication = {
  callbackSubmit: function(){
    var self = this;
    $('#sign-in').bind("ajax:success", function(e, response, status, xhr){
      if(response.success){
        window.location.reload();
      } else {
        $('#signin_error_message').html(I18n.t('errors.messages.signin_fails'))
      }
    });
    $('#sign-up').bind("ajax:success", function(e, response, status, xhr){
      if(response.success){
        window.location.reload();
      } else {
        var errors_message = '';
        if(response.data.message.name){
          errors_message = '<p>' + errors_message
            + I18n.t('devise.registrations.name')
            + response.data.message.name + '</p>'
        };
        if(response.data.message.email){
          errors_message = '<p>' + errors_message
            + I18n.t('devise.registrations.email')
            + response.data.message.email + '</p>'
        };
        if(response.data.message.password){
          errors_message = '<p>' + errors_message
            + I18n.t('devise.registrations.password') + " "
            + response.data.message.password + '</p>'
        };
        if(response.data.message.password_confirmation){
          errors_message = '<p>' + errors_message
            + I18n.t('devise.registrations.password_confirmation')
            + response.data.message.password_confirmation + '</p>';
        };
        $('#signup_error_message').html(errors_message);
      }
    })
  }
};
