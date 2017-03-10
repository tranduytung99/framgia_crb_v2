class Notification < ApplicationRecord
  has_many :notification_events, dependent: :destroy
  has_many :events, through: :notification_events
end
