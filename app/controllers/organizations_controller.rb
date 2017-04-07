class OrganizationsController < ApplicationController
  load_and_authorize_resource

  def show
  end

  def new
  end

  def create
    @organization = current_user.organizations.new organization_params
    @organization.user_organizations.new user:current_user
    @organization.creator = current_user

    if @organization.save
      flash[:success] = t "flashs.created"
      redirect_to @organization
    else
      render :new
    end
  end

  def update
    if @organization.update organization_params
      render json: @organization
    else
      render partial: "shared/errors_messages", locals:{object: @organization}
    end
  end

  def destroy
    if @organization.teams.any?
      render json: t(".delete_failed_contains_team")
    elsif @organization.users.size > 1
      render json: t(".delete_failed_contains_users")
    elsif @organization.destroy
      load_organizations_of_current_user
      if @organizations.size > 0
        render partial: "organizations/organization", locals: {organizations: @organizations}
      else
        render partial: "organizations/empty_organization"
      end
    else
      render partial: "shared/errors_messages", locals: {object: @organization}
    end
  end

  private
  def organization_params
    params.require(:organization).permit Organization::ATTRIBUTE_PARAMS
  end
end
