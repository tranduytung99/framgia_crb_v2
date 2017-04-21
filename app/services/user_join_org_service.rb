class UserJoinOrgService
  def initialize p
    @params = p
  end

  def check_create 
  	@user = User.find_by slug: @params[:invitation][:user_id]
    @org = Organization.find_by slug: @params[:organization_id]
    @kt = UserOrganization.where(organization_id: @org.id).where(user_id: @user.id).first
    if @kt.present?
      @kt.destroy
      @user_org = UserOrganization.create(organization_id: @org.id, user_id: @user.id, status: 0)
    else
      @user_org = UserOrganization.create(organization_id: @org.id, user_id: @user.id, status: 0)
    end
    @user_org
  end

  def update
    @user = User.find_by slug: @params[:id]
    @org = Organization.find_by slug: @params[:organization_id]
    UserOrganization.create(organization_id: @org.id, user_id: @user.id)
  end
end
