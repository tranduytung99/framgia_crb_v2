class InvitesController < ApplicationController
  def index
    @organization = Organization.find_by id: params[:organization_id]
  end
end
