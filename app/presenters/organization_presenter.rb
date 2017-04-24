class OrganizationPresenter
  def initialize organization
    @organization = organization
    calendars
  end

  def workspaces
    @workspaces ||= @organization.workspaces
  end

  def members
    @members ||= @organization.users
  end

  def workspace_calendars
    if @calendars["Workspace"].nil?
      return @workspace_calendars = NullCalendar.workspace_calendars
    end
    @workspace_calendars ||= @calendars["Workspace"].group_by &:owner_id
  end

  def direct_calendars
    if @calendars["Organization"].nil?
      return @direct_calendars = NullCalendar.direct_calendars
    end
    @direct_calendars ||= @calendars["Organization"].group_by &:owner_id
  end

  private

  def calendars
    @calendars ||= Calendar.of_org(@organization).group_by &:owner_type
  end
end
