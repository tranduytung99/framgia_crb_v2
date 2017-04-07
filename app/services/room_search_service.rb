class RoomSearchService
  include ActiveModel::Validations

  validates_presence_of :start_time, :finish_time
  validate :start_time_is_after_finish_time
  attr_accessor :start_time, :finish_time

  def initialize user, params
    @user = user
    @start_time = params[:start_time]
    @finish_time = params[:finish_time]
  end

  def perform
    calendars = Calendar.managed_by_user @user
    calendar_ids = calendars.map{|calendar| calendar.id}
    all_events = load_all_events calendar_ids
    results = []

    calendars.each do |calendar|
      events = load_events all_events, calendar.id
      results << calendar if check_room_is_empty?(events)
    end
    results
  end

  private

  def load_all_events calendar_ids
    events = Event.in_calendars calendar_ids
    calendar_service = CalendarService.new events
    calendar_service.repeat_data
  end

  def load_events all_events, calendar_id
    all_events.map{|event| event if event.calendar_id == calendar_id}
      .sort_by{|event| event.start_date}
  end

  def check_room_is_empty? events
    return true if events.size == 0
    is_empty = true
    events.each do |event|
      next if @start_time >= event.finish_date || @finish_time <= event.start_date
      is_empty = false
      break
    end
    is_empty
  end

  def start_time_is_after_finish_time
    errors.add(:time_errors, "Start time is after finish time!") if @start_time >= @finish_time
  end
end
