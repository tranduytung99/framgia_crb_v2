class CalendarPresenter
  attr_reader :user, :organization

  def initialize user, organization = nil
    @user = user
    @organization = organization
  end

  def my_calendars
    @my_calendars ||= calendars
  end

  def other_calendars
    @other_calendars ||= @user.other_calendars
  end

  def manage_calendars
    @manage_calendars ||= @user.manage_calendars
  end

  def calendars_json
    calendars.map do |calendar|
      {
        id: calendar.id,
        name: calendar.name,
        building: calendar.workspace || "My Calendars"
      }
    end.to_json
  end

  def default_view
    current_zone_object.setting_default_view
  end

  def full_timezone_name
    ["GMT%+02d" % current_zone_object.setting_timezone, tzinfo_name].join(" ")
  end

  def tzinfo_name
    timezone.tzinfo.name
  end

  private

  def existed_org?
    @existed_org ||= @organization.present?
  end

  def current_zone_object
    @obj ||= existed_org? ? @organization : @user
  end

  def timezone
    @timezone ||= ActiveSupport::TimeZone[current_zone_object.setting_timezone_name]
  end

  def calendars
    if existed_org?
      @calendars ||= Calendar.of_org(@organization)
    else
      @calendars ||= Calendar.of_user(@user)
    end
  end
end
