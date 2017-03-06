# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
20.times do |n|
  name  = FFaker::Name.name
  email = "example-#{n + 1}@framgia.com"
  password = "password"
  user = User.create! name: name,
    email: email,
    password: password,
    password_confirmation: password
  user.create_setting timezone_name: ActiveSupport::TimeZone.all.sample.name
end
