class TeamsController < ApplicationController
  load_and_authorize_resource

  def new
    @team = Team.new
  end

  def show
  end

  def create
    @organization = Organization.find_by id: params[:organization_id]
    @team = @organization.teams.build team_params

    if @team.save
      redirect_to organization_path(@organization), notice: t(".created_team")
    else
      render :new
    end
  end

  def update
    if @team.update team_params
      render json: @team
    else
      render :new
    end
  end

  private

  def team_params
    params.require(:team).permit Team::ATTR_PARAMS
  end
end
