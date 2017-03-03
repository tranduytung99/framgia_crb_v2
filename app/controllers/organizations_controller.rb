class OrganizationsController < ApplicationController
  load_and_authorize_resource
  before_action :load_organizations_of_current_user, only: [:index]

  def index
    @organization = Organization.new
  end

  def show
  end

  def create
    @organization = Organization.new organization_params
    respond_to do |format|
      if @organization.save
        @organizations = load_organizations_of_current_user
        format.html {render partial: "organization", locals:{organizations: @organizations}}
      else
        format.html {render partial: "shared/errors_messages", locals:{object: @organization}}
      end
    end
  end

  def update
    if @organization.update organization_params
      render json: @organization
    else
      render :edit
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

  def load_organizations_of_current_user
    @organizations = Organization.accepted_by_user(current_user).order_by_creation_time
      .page(params[:page]).per Settings.organization_limit.to_i
  end
end
