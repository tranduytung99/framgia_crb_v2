class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :avatar
end
