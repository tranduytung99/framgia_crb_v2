class Permission < ActiveRecord::Base
  belongs_to :user, dependent: :destroy
end
