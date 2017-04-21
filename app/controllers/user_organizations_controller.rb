class UserOrganizationsController < ApplicationController
   skip_load_and_authorize_resource :only => :edit

  def create
    user_ids = params[:user_ids]
    org_id = params[:user_organization][:organization_id]
    user_org_params = {user_id: user_ids, organization_id: org_id}
    @user_organization = UserOrganization.create user_org_params
    redirect_to :back, notice: t(".invited")
  end

  def update
    if @user_organization.update_attributes status: "#{params[:commit]}"
      redirect_to organizations_path, notice: t(".updated", status: "#{params[:commit]}")
    else
      redirect_to organizations_path, notice: t(".failed")
    end
  end

  def edit
    @user = User.find(params[:id])
  end

  def invited
    @user = User.find params[:id]
    @organizations = Organization.find params[:organization_id]
    @user_organization = UserOrganization.create(user_id: @user.id, organization_id: @organizations.id)
    redirect_to root_url
  end

  private

  def user_organization_params
    params.require(:user_organization).permit UserOrganization::ATTRIBUTE_PARAMS
  end
end
