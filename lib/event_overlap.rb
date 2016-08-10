class EventOverlap
  ATTRS = [:time_overlap]
  attr_accessor *ATTRS

  def initialize event = nil
    @event = event
    @time_overlap = nil
    set_start_time_and_end_time
    array_time_from_fullcalendar @event.calendar_id, @event.place_id, @event.parent_id
    array_time_from_event @event
  end

  def overlap?
    @array_time_fullcalendar.each do |time_fullcalendar|
      @array_time_event.each do |time_event|
        if compare_time? time_fullcalendar, time_event
          @time_overlap = time_event[:start_date]
          return true
        end
      end
    end
    false
  end

  private
  def set_start_time_and_end_time
    if @event.start_repeat.present?
      @start_time = @event.start_repeat
      @end_time = @event.end_repeat
    else
      @start_time = @event.start_date
      @end_time = @event.finish_date
    end
  end

  def array_time_from_fullcalendar calendar_id, place_id, parent_id
    if parent_id.nil?
      events = Event.events_in_place calendar_id, place_id
    else
      events = Event.events_in_place(calendar_id, place_id).reject parent_id
    end

    @array_time_fullcalendar = FullcalendarService.new(events, @start_time,
     @end_time).repeat_data
      .select do |event|
      event.exception_type.nil? || (!event.delete_only? && !event.delete_all_follow?)
    end

    @array_time_fullcalendar = @array_time_fullcalendar.collect do |event|
      {start_date: event.start_date, finish_date: event.finish_date}
    end

    @array_time_fullcalendar = @array_time_fullcalendar.sort_by do |event|
      event[:start_date]
    end
  end

  def array_time_from_event event
    @array_time_event =
      FullcalendarService.new([event], @start_time, @end_time).generate_event.collect do |event|
      {start_date: event.start_date, finish_date: event.finish_date}
    end
  end

  def compare_time? time1, time2
    (time1[:start_date].to_datetime - time2[:finish_date].to_datetime) *
      (time1[:finish_date].to_datetime - time2[:start_date].to_datetime) < 0
  end
end
