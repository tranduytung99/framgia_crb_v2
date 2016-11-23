class Organization < ActiveRecord::Base
  has_many :user_organizations, dependent: :destroy
  has_many :users, through: :user_organizations
  belongs_to :owner, class_name: User.name, foreign_key: :owner_id

  validates :name, presence: true, uniqueness: true

  delegate :name, to: :owner, prefix: :owner, allow_nil: true

  after_save :add_owner_to_organization

  scope :joins_with_users, -> do
    select("organizations.*, users.id as user_id, users.name as user_name")
      .joins("INNER JOIN users ON organizations.owner_id = users.id")
  end

  ORG_PARAMS = [:name, :owner_id]

  private

  def add_owner_to_organization
    @user_organization = UserOrganization.create user_id: self.owner_id,
      organization_id: self.id
  end
end
