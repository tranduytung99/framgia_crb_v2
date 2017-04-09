Fabricator :event do
  title {FFaker::Lorem.word}
  user_id
  description {FFaker::Lorem.sentence}
  start_date {DateTime.new(2016,2,3,8,0,0,"+7")}
  finish_date {DateTime.new(2016,2,3,8,0,0,"+7")}
  start_repeat {DateTime.new(2016,2,3,8,0,0,"+7")}
  end_repeat {DateTime.new(2016,2,3,8,0,0,"+7")}
  calendar_id
  repeat_type
  repeat_every
  chatwork_room_id Settings.chatwork_room_id
  message_content {FFaker::Lorem.sentence}
  task_content {FFaker::Lorem.sentence}
end
