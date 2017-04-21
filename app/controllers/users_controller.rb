class UsersController < ApplicationController
  load_and_authorize_resource find_by: :slug
  layout "ajax", only: :index

  def show
    resource.setting || resource.build_setting
  end

  def index
    if params[:email].empty?
      @user = User.where("email = '#{params[:email]}'")
      @organ_slug = params[:organ_slug]
    else
      @user = User.where("email LIKE '%#{params[:email]}%'")
      @organ_slug = params[:organ_slug]
    end
  end

  def edit
    @user = User.find params[:id]
    @organ =Organization.find params[:organization_id]
    @check = UserOrganization.where(user_id: @user.id).where(organization_id: @organ.id)
  end

  def invite_join_organ
    flash[:succes] = "Send invite succes"
    @send = UserMailer.send_email_invite_member(params[:id], params[:organization_id]).deliver
    redirect_to root_url
  end
end
