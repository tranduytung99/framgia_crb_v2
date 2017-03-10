class RepeatOn < ApplicationRecord
  belongs_to :event
  belongs_to :days_of_week
end
