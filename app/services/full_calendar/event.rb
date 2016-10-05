module FullCalendar
  class Event
    alias :read_attribute_for_serialization :send
    include SharedMethods

    def self.model_name
      @_model_name ||= ActiveModel::Name.new(self)
    end

    ATTRS = [:id, :title, :description, :status, :color, :all_day,
      :repeat_type, :repeat_every, :user_id, :calendar_id, :start_date,
      :finish_date, :start_repeat, :end_repeat, :exception_time, :exception_type,
      :event_id, :persisted, :event]

    attr_accessor *ATTRS

    delegate :calendar_name, to: :event, prefix: :event

    def initialize event, persisted = false
      ATTRS[1..-4].each do |attr|
        instance_variable_set "@#{attr}", event.send(attr)
      end
      @persisted = persisted
      @event = event
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

    def delete_only?
      self.event.delete_only?
    end

    def delete_all_follow?
      self.event.delete_all_follow?
    end

    def parent
      self.event
    end
  end
end
