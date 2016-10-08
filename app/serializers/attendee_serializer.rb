class AttendeeSerializer < ActiveModel::Serializer
  attributes :id, :email

  belongs_to :user

  def email
    object.email || object.user.email
  end
end
