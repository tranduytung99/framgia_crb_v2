class OrganizationPresenter
  def initialize organization
    @organization = organization
  end

  def workspaces
    @workspaces ||= @organization.workspaces
  end

  def members
    @members ||= @organization.users
  end
end
