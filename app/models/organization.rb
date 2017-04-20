class Organization < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: [:slugged, :finders]

  mount_uploader :logo, ImageUploader

  belongs_to :creator, class_name: User.name, foreign_key: :creator_id
  has_many :user_organizations, dependent: :destroy
  has_many :users, through: :user_organizations
  has_many :teams, dependent: :destroy
  has_many :calendars, as: :owner
  has_many :workspaces
  has_one :setting, as: :owner

  validates :name, presence: true, uniqueness: {case_sensitive: false}

  delegate :name, to: :owner, prefix: :owner, allow_nil: true
  delegate :timezone, :timezone_name, :default_view,
    to: :setting, prefix: true, allow_nil: true

  accepts_nested_attributes_for :workspaces,
    reject_if: proc {|attributes| attributes["name"].blank?}
  accepts_nested_attributes_for :setting

  scope :accepted_by_user, ->(user) do
    select("organizations.*")
      .joins("INNER JOIN user_organizations
      ON organizations.id = user_organizations.organization_id
      WHERE user_organizations.status = 1
      AND user_organizations.user_id = #{user.id}")
  end

  scope :order_by_creation_time, -> {order created_at: :desc}
  scope :order_by_updated_time, -> {order updated_at: :desc}

  ATTRIBUTE_PARAMS = [:name, :logo,
    workspaces_attributes: [:id, :name, :address],
    setting_attributes: [:id, :timezone_name, :default_view, :country]].freeze
end
