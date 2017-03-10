class Permission < ApplicationRecord
  belongs_to :user, dependent: :destroy
end
