module EventsHelper
  def select_my_calendar calendars
    calendars.collect do |calendar|
      [calendar.name, calendar.id]
    end
  end

  def range_time event, start_time, finish_time
    # timezone = event.calendar.owner.setting.timezone rescue 7
    start_time = DateTime.strptime start_time, t("events.datetime")

    start_time_in_timezone = start_time#.in_time_zone(timezone)
    if event.all_day?
      start_time_in_timezone.strftime("%B %-d %Y")
    else
      finish_time = DateTime.strptime finish_time, t("events.datetime")
      finish_time_in_timezone = finish_time#.in_time_zone(timezone)
      dname = start_time_in_timezone.strftime("%A")
      stime_name = start_time_in_timezone.strftime("%H:%M %p")
      ftime_name = finish_time_in_timezone.strftime("%H:%M %p")
      dtime_name = finish_time_in_timezone.strftime("%m-%d-%Y")

      dname + " " + stime_name + " To " + ftime_name + " " + dtime_name
    end
  end
end
