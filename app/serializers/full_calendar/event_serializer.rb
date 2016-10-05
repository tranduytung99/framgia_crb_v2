module FullCalendar
  class EventSerializer < ActiveModel::Serializer
    include SharedMethods

    attributes :id, :title, :description, :status, :color, :all_day,
      :repeat_type, :repeat_every, :user_id, :calendar_id, :start_date,
      :finish_date, :start_repeat, :end_repeat, :exception_time, :exception_type,
      :event_id, :persisted, :place_id, :attendees, :color_id, :calendar_name,
      :repeat_ons, :notification_events, :owner, :place, :name_place, :place_id, :editable

    def place_id
      event.place_id
    end

    def attendees
      event.attendees
    end

    def repeat_ons
      event.repeat_ons
    end

    def notification_events
      event.notification_events
    end

    def owner
      event.owner
    end

    def place
      event.place
    end

    def name_place
      event.name_place || place.name
    end

    def place_id
      event.place_id
    end

    def start_date
      format_datetime(object.start_date)
    end

    def finish_date
      format_datetime(object.finish_date)
    end

    def start_repeat
      format_date(event.start_repeat)
    end

    def end_repeat
      format_date(event.end_repeat)
    end

    def color_id
      calendar.get_color(current_user.id)
    end

    def calendar_name
      calendar.name
    end

    def editable
      valid_permission_user_in_calendar?
    end

    private
    def event
      object.event
    end

    def calendar
      event.calendar
    end

    def valid_permission_user_in_calendar?
      user_calendar = current_user.user_calendars
        .find_by(calendar_id: event.calendar_id)
      Settings.permissions_can_make_change.include? user_calendar.permission_id
    end
  end
end
