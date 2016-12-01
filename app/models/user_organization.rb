class UserOrganization < ActiveRecord::Base
  belongs_to :user
  belongs_to :organization

  after_create :send_invitation_email

  delegate :name, :owner_id, to: :organization, prefix: true

  enum status: [:waiting, :accept]

  ATTRIBUTE_PARAMS = [:organization_id]

  def send_invitation_email
    argv = {
      user_id: self.user_id,
      organization_id:  self.organization_id,
      action_type: :invite_organization
    }

    unless self.organization_owner_id == self.user_id
      EmailWorker.perform_async argv
    end
  end
end
