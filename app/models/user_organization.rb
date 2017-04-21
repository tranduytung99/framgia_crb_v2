class UserOrganization < ApplicationRecord
  belongs_to :user
  belongs_to :organization

  after_create :send_invitation_email

  delegate :name, :creator_id, to: :organization, prefix: true
  scope :search_user_and_org, ->u,r{where "user_id = ? AND organization_id = ?", "#{u}", "#{r}"}
  enum status: [:waiting, :accept]

  ATTRIBUTE_PARAMS = [:organization_id]

  def send_invitation_email
    @send_email = UserMailer.send_email_invite_to_join_organization(
    self.user_id, self.organization_id).deliver
  end
  handle_asynchronously :send_invitation_email, :run_at => Proc.new { 1.minutes.from_now }
end
