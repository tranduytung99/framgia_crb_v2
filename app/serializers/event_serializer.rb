class EventSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :status, :color, :all_day,
    :repeat_type, :repeat_every, :user_id, :calendar_id, :start_date,
    :finish_date, :start_repeat, :end_repeat, :exception_time, :exception_type,
    :old_exception_type, :parent_id, :name_place, :place_id, :chatwork_room_id,
    :task_content, :message_content, :google_event_id, :google_calendar_id, :deleted_at

  has_many :attendees
  has_many :users, through: :attendees
  has_many :days_of_weeks
  has_many :event_exceptions, class_name: Event.name, foreign_key: :parent_id
  has_many :notification_events

  belongs_to :calendar
  belongs_to :owner, class_name: User.name, foreign_key: :user_id
  belongs_to :event_parent, class_name: Event.name, foreign_key: :parent_id
  belongs_to :place

  def color
    object.color || object.calendar.color.try(:color_hex)
  end

  def start_date
    format_datetime(object.start_date.in_time_zone(timezone))
  end

  def finish_date
    format_datetime(object.finish_date.in_time_zone(timezone))
  end

  def start_repeat
    format_date(object.start_repeat.in_time_zone(timezone)) if object.start_repeat
  end

  def end_repeat
    format_date(object.end_repeat.in_time_zone(timezone)) if object.end_repeat
  end
end
