class NotificationEventSerializer < ActiveModel::Serializer
  attributes :id, :notification
  belongs_to :notification
end
