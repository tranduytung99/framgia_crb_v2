class Api::EventsController < Api::BaseController
  serialization_scope :current_user

  respond_to :json
  before_action :load_event, except: [:index, :new, :edit]
  before_action only: [:edit, :update, :destroy] do
    validate_permission_change_of_calendar @event.calendar
  end
  before_action only: :show do
    validate_permission_see_detail_of_calendar @event.calendar
  end

  def index
    @events = Event.in_calendars params[:calendars]
    render json: @events, each_serializer: EventSerializer,
      root: :events, adapter: :json,
      meta: t("api.request_success"), meta_key: :message,
      status: :ok
  end

  def create
    create_service = Events::CreateService.new current_user, params
    if create_service.perform
      render json: create_service.event, serializer: EventSerializer,
        root: :event, adapter: :json,
        meta: t("api.create_event_success"), meta_key: :message, status: :ok
    else
      if create_service.is_overlap
        render json: {message: I18n.t("api.event_overlap")}
      else
        render json: {errors: I18n.t("api.create_event_failed")}, status: 422
      end
    end
  end

  def update
    update_service = Events::UpdateService.new current_user, @event, params
    if update_service.perform
      render json: update_service.event, serializer: EventSerializer,
        root: :event, adapter: :json,
        meta: t("events.flashs.updated"), meta_key: :message, status: :ok
    else
      render json: {
        message: t("events.flashs.not_updated_because_overlap")
      }, status: :bad_request
    end
  end

  def show
    render json: @event, serializer: EventSerializer,
      root: :event, adapter: :json,
      meta: t("api.show_detail_event_suceess"), meta_key: :message
  end

  def destroy
    delete_service = Events::DeleteService.new(@event, params)

    if delete_service.perform
      render json: {message: t("events.flashs.deleted")}, status: :ok
    else
      render json: {message: t("events.flashs.not_deleted")}
    end
  end

  private
  def event_params
    params.require(:event).permit Event::ATTRIBUTES_PARAMS
  end

  def load_event
    @event = Event.find_by id: params[:id]
  end
end
