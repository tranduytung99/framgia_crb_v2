class Calendar < ApplicationRecord
  belongs_to :color
  belongs_to :creator, class_name: User.name, foreign_key: :creator_id
  belongs_to :owner, polymorphic: true
  has_many :events, dependent: :destroy
  has_many :user_calendars, dependent: :destroy
  has_many :users, through: :user_calendars
  has_many :sub_calendars, class_name: Calendar.name, foreign_key: :parent_id

  ATTRIBUTES_PARAMS = [:name, :number_of_seats, :google_calendar_id, :description, :owner_id,
    :owner_type, :color_id, :parent_id, :status,
    user_calendars_attributes: [:id,
      :user_id,
      :permission_id,
      :color_id,
      :_destroy
    ]
  ].freeze

  accepts_nested_attributes_for :user_calendars, allow_destroy: true

  before_create :make_user_calendar

  enum status: [:no_public, :share_public, :public_hide_detail]

  delegate :name, to: :owner, prefix: true, allow_nil: true

  scope :of_user, ->user do
    select("calendars.*, uc.user_id, uc.calendar_id, uc.permission_id, \n
      uc.is_checked, uc.color_id as uc_color_id")
      .joins("INNER JOIN user_calendars as uc \n
        ON calendars.id = uc.calendar_id \n
        AND calendars.creator_id = uc.user_id WHERE calendars.owner_id = #{user.id}")
  end
  scope :shared_with_user, ->user do
    select("calendars.*, uc.user_id, uc.calendar_id, uc.permission_id, \n
      uc.is_checked, uc.color_id as uc_color_id")
      .joins("INNER JOIN user_calendars as uc \n
        ON uc.calendar_id = calendars.id \n
        WHERE uc.user_id = #{user.id} AND calendars.owner_id <> #{user.id}")
  end
  scope :managed_by_user, ->user do
    select("calendars.*, uc.user_id, uc.calendar_id, uc.permission_id, \n
      uc.is_checked, uc.color_id as uc_color_id")
      .joins("INNER JOIN user_calendars as uc \n
        ON uc.calendar_id = calendars.id \n
        WHERE uc.user_id = #{user.id} AND uc.permission_id IN (1,2)")
  end
  scope :with_user, ->user do
    select("calendars.*, uc.user_id, uc.calendar_id, uc.permission_id, \n
      uc.is_checked, uc.color_id as uc_color_id")
      .joins("INNER JOIN user_calendars as uc ON calendars.id = uc.calendar_id")
      .where("uc.user_id = ?", user.id)
  end

  def get_color user_id
    user_calendar = user_calendars.find_by user_id: user_id
    color_id = user_calendar.color_id
  end

  def parent?
    parent_id.nil?
  end

  def organization
    return owner_name if [Organization.name, User.name].include?(owner_type)
    return owner.organization_name if owner_type == Workspace.name
  end

  def workspace
    owner_name if owner_type == Workspace.name
  end

  def user_name
    owner_name if owner_type == User.name
  end

  private
  def make_user_calendar
    self.user_calendars.new user_id: self.creator_id, permission_id: 1,
      color_id: self.color_id
  end
end
