class DaysOfWeek < ApplicationRecord
  has_many :repeat_ons, dependent: :destroy
  has_many :events, through: :repeat_ons
end
