class PushEventWorker
  include Sidekiq::Worker

  def initialize_googleapi_client
    keypath = Rails.root.join("config", "client.p12").to_s
    key = Google::APIClient::PKCS12.load_key(keypath, "notasecret")

    @client = Google::APIClient.new({application_name: I18n.t("events.framgia_crb_system"),
      application_version: "1.0"})
    @client.authorization = Signet::OAuth2::Client.new(
      token_credential_uri: "https://accounts.google.com/o/oauth2/token",
      audience: "https://accounts.google.com/o/oauth2/token",
      scope: "https://www.googleapis.com/auth/calendar",
      issuer: "framgia-crb-system@framgia-crb-system.iam.gserviceaccount.com",
      signing_key: key)
    @client.authorization.fetch_access_token!
  end

  def perform event_id
    event = Event.find_by id: event_id
    attendees = event.attendees.map{|attendee| {email: attendee.attendee_email}}
    event_push = {
      summary: event.title,
      location: event.place.name,
      description: event.description,
      start: {dateTime: event.start_date.strftime(I18n.t("events.time.datetime_ft_t_z"))},
      end: {dateTime: event.finish_date.strftime(I18n.t("events.time.datetime_ft_t_z"))},
      attendees: attendees
    }
    initialize_googleapi_client
    api_method = @client.discovered_api("calendar", "v3").events.insert
    @result = @client.execute(api_method: api_method,
      parameters: {calendarId: "primary"},
      body: JSON.dump(event_push),
      headers: {"Content-Type" => "application/json"})
  end
end
