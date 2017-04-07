class Workspace < ApplicationRecord
  mount_uploader :logo, ImageUploader

  belongs_to :organization
  has_many :calendars
end
