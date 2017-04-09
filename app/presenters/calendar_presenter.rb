class CalendarPresenter
  def initialize user
    @user = user
  end

  def my_calendars
    @my_calendars ||= @user.my_calendars
  end

  def other_calendars
    @other_calendars ||= @user.other_calendars
  end

  def manage_calendars
    @manage_calendars ||= @user.manage_calendars
  end

  def calendars_json
    @calendars ||= Calendar.with_user @user
    @calendars.map do |calendar|
      {
        id: calendar.id,
        name: calendar.name,
        organization: calendar.organization,
        workspace: calendar.workspace,
        user_name: calendar.user_name
      }
    end.to_json
  end
end
