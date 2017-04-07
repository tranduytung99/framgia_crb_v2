class UserOrganization < ApplicationRecord
  belongs_to :user
  belongs_to :organization

  after_create :send_invitation_email

  delegate :name, :creator_id, to: :organization, prefix: true

  enum status: [:waiting, :accept]

  ATTRIBUTE_PARAMS = [:organization_id]

  def send_invitation_email
    unless self.organization_creator_id == self.user_id
      argv = {
        user_id: self.user_id,
        organization_id:  self.organization_id,
        action_type: :invite_organization
      }

      EmailWorker.perform_async argv
    end
  end
end
