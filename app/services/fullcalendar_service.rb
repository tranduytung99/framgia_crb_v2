class FullcalendarService
  attr_accessor :events, :db_events

  def initialize db_events = nil
    @events = Array.new
    @db_events = db_events
  end

  def repeat_data
    event_no_repeats = @db_events.no_repeats

    event_no_repeats.each do |event|
      @events << EventFullcalendar.new(event, true)
    end

    (@db_events - event_no_repeats).each do |event|
      next unless event.parent?
      generate_repeat_from_event_parent event
    end

    @events
  end

  def generate_event
    event = @db_events.first

    if event.repeat_type.nil?
      @events << EventFullcalendar.new(event)
    else
      generate_repeat_from_event_parent event
    end

    @events
  end

  def generate_event_delay event
    generate_repeat_from_event_parent event, Settings.notify_type.email
  end

  private
  def generate_repeat_from_event_parent event, function = nil
    if event.repeat_daily?
      repeat_daily event, event.start_repeat.to_date, function
    elsif event.repeat_weekly?
      start_day = event.start_repeat.wday

      event.days_of_weeks.each do |days_of_week|
        @repeat_on_day = Settings.event.repeat_data.index(days_of_week.name)
        repeat_date = event.start_repeat.to_date

        if @repeat_on_day == start_day
          start = repeat_date
        elsif @repeat_on_day > start_day
          start = repeat_date + (@repeat_on_day - start_day).days
        else
          start = repeat_date + (Settings.seven + @repeat_on_day - start_day).days
        end

        repeat_weekly event, start, function
      end
    elsif event.repeat_monthly?
      repeat_monthly event, event.start_repeat.to_date, function
    elsif event.repeat_yearly?
      repeat_yearly event, event.start_repeat.to_date, function
    end
  end

  def repeat_daily event, start, function = nil
    show_repeat_event event, event.repeat_every.days, start, function
  end

  def repeat_weekly event, start, function = nil
    show_repeat_event event, event.repeat_every.weeks, start, function
  end

  def repeat_monthly event, start, function = nil
    show_repeat_event event, event.repeat_every.months, start, function
  end

  def repeat_yearly event, start, function = nil
    show_repeat_event event, event.repeat_every.years, start, function
  end

  def weekly_start_exception event
    exception_day = event.exception_time.wday
    exception_date = event.exception_time.to_date

    if @repeat_on_day == exception_day
      return exception_date
    elsif @repeat_on_day > exception_day
      return exception_date + (@repeat_on_day - exception_day).days
    else
      return exception_date + (Settings.seven + @calculate_day - exception_day).days
    end
  end

  def show_repeat_event event, step, start, function = nil
    ex_destroy_events = Array.new
    ex_update_events = Array.new
    ex_edit_follow =  Array.new
    ex_update_follow = Array.new
    repeat_event = [start]

    event.event_exceptions.each do |exception_event|
      if exception_event.delete_only?
        ex_destroy_events << exception_event.exception_time.to_date
      elsif exception_event.delete_all_follow?
        if event.repeat_weekly?
          ex_destroy_events << weekly_start_exception(exception_event)
        else
          ex_destroy_events << exception_event.exception_time.to_date
        end

        while ex_destroy_events.last <= exception_event.end_repeat.to_date - step
          ex_destroy_events << ex_destroy_events.last + step
        end
      elsif exception_event.edit_only?
        unless event.repeat_weekly? && start.wday != exception_event.exception_time.wday
          ex_update_events << exception_event.exception_time.to_date
          event_fullcalendar = EventFullcalendar.new exception_event, true
          @events << event_fullcalendar

          if function.present?
            NotificationEmailService.new(event, event_fullcalendar).perform
          end
        end
      elsif exception_event.edit_all_follow?
        ex_edit_follow << exception_event
      end
    end

    ex_edit_follow.each do |exception_event|
      times_occurs = []
      if event.repeat_weekly?
        start_exceptiop_date = weekly_start_exception exception_event
        ex_update_follow << start_exceptiop_date
        times_occurs << start_exceptiop_date
      else
        ex_update_follow << exception_event.exception_time.to_date
        times_occurs << exception_event.exception_time.to_date
      end

      while ex_update_follow.last <= exception_event.end_repeat.to_date - step
        ex_update_follow << ex_update_follow.last + step
        times_occurs << times_occurs.last + step
      end

      (times_occurs - ex_destroy_events - ex_update_events).each do |follow_time|
        event_fullcalendar = EventFullcalendar.new exception_event
        event_fullcalendar.update_info(follow_time)

        @events << event_fullcalendar

        if function.present?
          NotificationEmailService.new(event, event_fullcalendar).perform
        end
      end
    end

    while repeat_event.last <= event.end_repeat.to_date - step
      repeat_event << repeat_event.last + step
    end

    range_repeat_time = repeat_event - ex_destroy_events -
      ex_update_events - ex_update_follow

    range_repeat_time.each do |repeat_time|
      event_temp = EventFullcalendar.new event
      event_temp.update_info(repeat_time)
      @events << event_temp

      if function.present?
        NotificationEmailService.new(event, event_temp).perform
      end
    end
  end
end
