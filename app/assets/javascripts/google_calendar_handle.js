var apiKey = 'AIzaSyBhk4cnXogD9jtzPVsp_zuJuEKhBRC-skI';
var discoveryDocs = ['https://people.googleapis.com/$discovery/rest?version=v1'];
var clientId = '711894861528-oc65di769bdauvm3u52hgl4pedo972o1.apps.googleusercontent.com';
var scopes = 'https://www.googleapis.com/auth/calendar';

var authorizeButton = document.getElementById('authorization_google_api');
var signoutButton = document.getElementById('signout_google_api');

var google_oauth_token;

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
      apiKey: apiKey,
      discoveryDocs: discoveryDocs,
      clientId: clientId,
      scope: scopes
  }).then(function () {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    makeApiCall();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function makeApiCall() {
  gapi.client.people.people.get({
    resourceName: 'people/me'
  }).then(function(resp) {
    google_oauth_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
  })
}

$(document).ready(function() {
  $('#authorization_google_api').on('click', function(){
    var current_user_id = $('#header-avatar').data('current-user-id');
    $.ajax({
      url: '/handle_tokens/'+ current_user_id,
      type: 'PATCH',
      dataType: 'JSON',
      data: {user: {'google_oauth_token': google_oauth_token}},
      success: function(response){}
    })
  })
});
