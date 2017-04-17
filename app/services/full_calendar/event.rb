module FullCalendar
  class Event
    alias :read_attribute_for_serialization :send
    include SharedMethods

    def self.model_name
      @_model_name ||= ActiveModel::Name.new(self)
    end

    ATTRS = [:id, :start_date, :finish_date, :event_id, :persisted, :event, :user]

    attr_accessor *ATTRS

    delegate :calendar_name, :title, :description, :status, :color, :all_day,
      :repeat_type, :repeat_every, :user_id, :calendar_id, :start_repeat,
      :end_repeat, :exception_time, :exception_type, to: :event, allow_nil: true

    def initialize event, user, persisted = false
      self.start_date = event.start_date
      self.finish_date = event.finish_date
      @event = event
      @user = user
      @id, @event_id = SecureRandom.urlsafe_base64, event.id
    end

    def update_info repeat_date
      start_time = self.start_date.seconds_since_midnight.seconds
      end_time = self.finish_date.seconds_since_midnight.seconds

      self.start_date = repeat_date.to_datetime + start_time
      self.finish_date = repeat_date.to_datetime + end_time
      self.id = Base64.encode64(self.event_id.to_s + "-" + self.start_date.to_s)
      self.persisted = @event.start_date == self.start_date
    end

    def owner
      event.owner
    end

    def notification_events
      event.notification_events
    end

    def attendees
      event.attendees
    end

    def repeat_ons
      event.repeat_ons
    end

    def calendar
      event.calendar
    end

    def editable
      valid_permission_user_in_calendar?
    end

    def delete_only?
      self.event.delete_only?
    end

    def delete_all_follow?
      self.event.delete_all_follow?
    end

    def parent
      self.event
    end

    private
    def valid_permission_user_in_calendar?
      user_calendar = self.user.user_calendars
        .find_by(calendar_id: self.event.calendar_id)

      return false if user_calendar.nil?
      Settings.permissions_can_make_change.include? user_calendar.permission_id
    end
  end
end
