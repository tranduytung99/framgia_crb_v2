class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :avatar, :setting_timezone
end
