class NotificationWorker
  include Sidekiq::Worker

  def perform event_id
    event = Event.find_by id: event_id
    NotificationService.new(event).perform if event.present?
  end
end
