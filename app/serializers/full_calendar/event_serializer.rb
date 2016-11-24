module FullCalendar
  class EventSerializer < ActiveModel::Serializer
    include SharedMethods

    attributes :id, :title, :description, :status, :color_id, :all_day,
      :repeat_type, :repeat_every, :user_id, :calendar_id, :start_date,
      :finish_date, :start_repeat, :end_repeat, :exception_time, :exception_type,
      :event_id, :persisted, :place_id, :attendees, :calendar_name,
      :repeat_ons, :name_place, :editable

    belongs_to :place
    belongs_to :owner
    has_many :notification_events
    belongs_to :calendar

    # def notification_events
    #   event.notification_events
    # end

    def name_place
      event.place_name || event.name_place
    end

    def color_id
      object.calendar.get_color(current_user.id)
    end

    private
    def event
      @event ||= object.event
    end

    def calendar
      @calendar ||= event.calendar
    end
  end
end
