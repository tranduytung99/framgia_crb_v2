class CalendarSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :status
end
