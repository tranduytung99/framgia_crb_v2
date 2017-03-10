class UserTeam < ApplicationRecord
  belongs_to :user
  belongs_to :team

  enum role: [:owner, :member]
end
