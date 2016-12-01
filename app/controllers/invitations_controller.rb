class InvitationsController < ApplicationController
  before_action :check_accept_permission, only: :show

  def show
  end

  private

  def check_accept_permission
    @user_organization = UserOrganization.find_by user_id: current_user.id,
      organization_id: params[:organization_id]
    if @user_organization.nil? || @user_organization.accept?
      redirect_to organizations_path, notice: t(".no_permission")
    end
  end
end
