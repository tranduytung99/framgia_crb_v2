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
    calendar_ids = calendars.map &:id
    all_events = load_all_events calendar_ids
    results = []

    calendars.each do |calendar|
      events = load_events all_events, calendar.id
      if check_room_is_empty?(events)
        results << {type: :empty, room: calendar}
      else
        time_suggests = suggest_time events
        if time_suggests.any?
          time_suggests.each do |time_suggest|
            results << {type: :suggest, room: calendar, time: time_suggest}
          end
        end
      end
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
    all_events.map{|event| event if event.calendar_id == calendar_id}.sort_by &:start_date
  end

  def suggest_time events
    delta = @finish_time.to_time - @start_time.to_time
    suggest_results = []
    events.each_with_index do |event, index|
      temp = (@start_time.to_time - event.start_date).abs
      next if temp > Settings.limited_suggest_time.hours

      suggest_start_time = event.start_date - delta
      suggest_finish_time = event.finish_date + delta

      suggest_time_before_event = suggest_time_before_event events, index, suggest_start_time
      suggest_time_after_event = suggest_time_after_event events, index, suggest_finish_time
      suggest_results << suggest_time_before_event if suggest_time_before_event.present?
      suggest_results << suggest_time_after_event if suggest_time_after_event.present?
    end
    suggest_results
  end

  def suggest_time_before_event events, index, suggest_start_time
    if index == 0 || suggest_start_time >= events[index - 1].finish_date
      {
        start_time: suggest_start_time,
        finish_time: events[index].start_date
      }
    end
  end

  def suggest_time_after_event events, index, suggest_finish_time
    if index == (events.size - 1) || suggest_finish_time <= events[index + 1].start_date
      {
        start_time: events[index].finish_date,
        finish_time: suggest_finish_time
      }
    end
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
