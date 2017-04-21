class InvitationsController < ApplicationController
  before_action :check_accept_permission, only: :show
  before_action :load_data, only: [:edit, :update, :destroy, :create]

  def show
  end

  def edit
    @invited = UserOrganization.where(organization_id: @organization.id, user_id: @user.id);
  end

  def create
    @user_org = UserJoinOrgService.new(params).check_create
    if @user_org
      flash[:success] = t ".success"
      redirect_to @organization
    else
      flash[:danger] = t ".danger"
    end
  end

  def update
    @user_org = UserOrganization.search_user_and_org(@user.id, @organization.id).first
    @user_org.update_attributes(status: 1)
    redirect_root
  end

  def destroy
    @user_org = UserOrganization.where(organization_id: @organization.id, user_id: @user.id).first
    if @user_org.destroy
      flash[:success] = t ".cancel_success"
      redirect_to @organization
    else
      flash[:danger] = t ".danger"
    end
  end

  private

  def check_accept_permission
    @user_organization = UserOrganization.find_by user_id: current_user.id,
      organization_id: params[:organization_id]

    return if @user_organization.present? || !@user_organization.accept?
    redirect_to organizations_path, notice: t(".no_permission")
  end

  def redirect_root
    redirect_to root_url
  end

  def load_data
    @organization = Organization.find_by slug: params[:organization_id]
    @user = User.find_by slug: params[:id]
  end
end
