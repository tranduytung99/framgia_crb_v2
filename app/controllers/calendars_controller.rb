class CalendarsController < ApplicationController
  load_and_authorize_resource except: [:index]
  before_action :load_colors, except: [:show, :destroy]
  before_action :load_users, :load_permissions, only: [:new, :edit]
  before_action :load_user_calendar, only: [:edit, :update]
  before_action only: [:edit, :update] do
    unless current_user.permission_manage? @calendar
      flash[:alert] = t("flash.messages.not_permission")
      redirect_to root_path
    end
  end

  def index
    @organization = Organization.find_by slug: params[:organization_id]
    @calendar_presenter = CalendarPresenter.new current_user, @organization
    @event = Event.new
  end

  def create
    @calendar.creator_id = current_user.id

    if @calendar.save
      ShareCalendarService.new(@calendar).share_sub_calendar
      flash[:success] = t "calendar.success_create"
      redirect_to root_path
    else
      flash[:alert] = t "calendar.danger_create"
      render :new
    end
  end

  def new
    @owners = [[current_user.name, current_user.id, {"data-owner-type": "User"}]]
    @owners += current_user.organizations.map do |org|
      [org.name, org.id, {"data-owner-type": "Organization"}]
    end
    @calendar.color = @colors.sample
  end

  def edit
    @user_selected = User.find_by email: params[:email] if params[:email]
  end

  def update
    @calendar.status = "no_public" unless calendar_params[:status]
    if @calendar.update_attributes calendar_params
      ShareCalendarService.new(@calendar).share_sub_calendar
      flash[:success] = t "calendar.success_update"
      redirect_to root_path
    else
      render :edit
    end
  end

  def destroy
    if @calendar.destroy
      flash[:success] = t "calendars.deleted"
    else
      flash[:alert] = t "calendars.not_deleted"
    end
    redirect_to root_path
  end

  private
  def calendar_params
    params.require(:calendar).permit Calendar::ATTRIBUTES_PARAMS
  end

  def load_colors
    @colors = Color.all
  end

  def load_users
    @users = User.all
  end

  def load_permissions
    @permissions = Permission.all
  end

  def load_user_calendar
    @user_calendar = @calendar.user_calendars.find_by user_id: current_user.id
  end
end
