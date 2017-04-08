namespace :db do
  desc "remake database data"
  task remake_data: :environment do

    # if Rails.env.production?
    #   puts "Not running in 'Production' task"
    # else
      %w[db:drop db:create db:migrate].each do |task|
        Rake::Task[task].invoke
      end

      puts "Create permission"
      Fabricate :permission, permission: I18n.t("permissions.permission_1")
      Fabricate :permission, permission: I18n.t("permissions.permission_2")
      Fabricate :permission, permission: I18n.t("permissions.permission_3")
      Fabricate :permission, permission: I18n.t("permissions.permission_4")

      Fabricate :notification, notification_type:
        I18n.t("events.notification.email")
      Fabricate :notification, notification_type:
        I18n.t("events.notification.chatwork")
      Fabricate :notification, notification_type:
        I18n.t("events.notification.desktop")

      user_hash = {
        "Nguyen Binh Dieu": "nguyen.binh.dieu@framgia.com",
        "Nguyen Van Quang": "nguyen.van.quang@framgia.com",
        "Nguyen Thi Thu Ha D": "nguyen.thi.thu.had@framgia.com",
        "Nguyen Thi Trong Nghia": "nguyen.thi.trong.nghia@framgia.com",
        "Nguyen Khac Hieu B": "nguyen.khac.hieub@framgia.com",
        "Nguyen van Dat": "nguyen.van.dat@framgia.com",
        "Do Hong Son": "do.hong.son@framgia.com",
        "Hoang Nhac Trung": "hoang.nhac.trung@framgia.com"
      }

      puts "Creating Color, User, Calendar, Share calendar, Event"

      Settings.colors.each do |color|
        Fabricate :color, color_hex: color
      end

      Settings.event.repeat_data.each do |date|
        Fabricate :days_of_week, name: date
      end


      user_hash.each do |name, email|
        user = Fabricate :user, name: name, email: email,
          auth_token: Devise.friendly_token
        Setting.create country: "VN", user_id: user.id,
          timezone_name: ActiveSupport::TimeZone.all.sample.name
      end

      org = Fabricate :organization, name: "Framgia Viet Nam", creator: User.first
      org.users << User.all

      [
        {
          workspace_name: "Ha noi Office",
          rooms: ["Dhaka", "Singapore", "Manila", "Phnom penh"],
        },
        {
          workspace_name: "Toong Office",
          rooms: ["Toong 01", "Toong 02"]
        },
        {
          workspace_name: "TKC Office",
          rooms: ["TKC 01", "TKC 02"]
        },
        {
          workspace_name: "Da nang Office",
          rooms: ["DN 01", "DN 02"]
        },
        {
          workspace_name: "HCM Office",
          rooms: ["HCM 01", "HCM 02"]
        }
      ].each do |ws_item|
        workspace = Fabricate :workspace, name: ws_item[:workspace_name],
          organization: org

        ws_item[:rooms].each do |room_name|
          Fabricate :calendar, owner: workspace,
            creator: User.first, name: room_name
        end
      end

    # end
  end
end
