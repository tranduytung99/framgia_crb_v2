class OrganizationsController < ApplicationController
  load_and_authorize_resource

  def index
    @organizations = Organization.accepted_by_user current_user
  end

  def new
    @organization = Organization.new
  end

  def show
  end

  def create
    @organization = Organization.new organization_params
    if @organization.save
      redirect_to organization_invite_path(@organization), notice: t(".created")
    else
      render :new
    end
  end

  def update
    if @organization.update organization_params
      redirect_to @organization, notice: t(".updated")
    else
      render :edit
    end
  end

  def destroy
    if @organization.destroy
      redirect_to organizations_url, notice: t(".deleted")
    else
      redirect_to organizations_url, notice: t(".failed")
    end
  end

  private

  def organization_params
    params.require(:organization).permit Organization::ATTRIBUTE_PARAMS
  end
end
