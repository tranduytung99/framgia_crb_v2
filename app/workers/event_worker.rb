require "concern/google_api.rb"

class EventWorker
  include Sidekiq::Worker
  include GoogleApi

  def perform event_id, action
    event = Event.find_by id: event_id
    @event_push = EventWorker.g_event_data event
    @client = EventWorker.initialize_googleapi_client
    if action === "insert"
      api_method = @client.discovered_api("calendar", "v3").events.insert
      @result = @client.execute(api_method: api_method,
        parameters: {calendarId: "primary"},
        body: JSON.dump(@event_push),
        headers: {"Content-Type" => "application/json"})
      event.update_attributes google_calendar_id: @result.data.iCalUID.as_json,
        google_event_id: @result.data.id.as_json
    elsif action === "update"
      api_method = @client.discovered_api("calendar", "v3").events.update
      @client.execute(api_method: api_method,
        parameters: {calendarId: "primary", eventId: event.google_event_id},
        body: JSON.dump(@event_push),
        headers: {"Content-Type" => "application/json"})
    else
      api_method = @client.discovered_api("calendar", "v3").events.delete
      @client.execute(api_method: api_method,
        parameters: {calendarId: "primary", eventId: event.google_event_id},
        headers: {"Content-Type" => "application/json"})
    end
  end
end
