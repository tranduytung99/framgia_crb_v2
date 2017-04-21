class SearchUserService
  def initialize p
    @params = p
  end

  def search
    if @params[:email].blank?
      @users = nil
    else
      @organization = Organization.find @params[:org_slug]
      @user_org = UserOrganization.where(organization_id: @organization.id).where(status: 0)
        .pluck :id
      @users = User.search_name_or_email(@params[:email]).where.not id: @user_org
    end
    @users
  end
end
