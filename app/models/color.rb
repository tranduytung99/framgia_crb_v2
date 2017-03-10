class Color < ApplicationRecord
  has_many :calendars
  has_many :user_calendars
end
