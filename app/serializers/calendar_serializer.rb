class CalendarSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :status,
    :organization, :workspace, :user_name
end
