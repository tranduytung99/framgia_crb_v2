module Events
  class UpdateService
    attr_accessor :is_overlap, :event

    def initialize user, event, params
      @user = user
      @event = event
      @params = params
    end

    def perform
      place = @user.places.find_by name: event_params[:name_place]
      @event.place_id = place.present? ? place.id : nil

      modify_repeat_params if @params[:repeat].blank?
      @params[:event] = @params[:event].merge({
        exception_time: event_params[:start_date],
        start_repeat: event_params[:start_repeat].blank? ? event_params[:start_date] : event_params[:start_repeat],
        end_repeat: event_params[:end_repeat].blank? ? @event.end_repeat : event_params[:end_repeat].to_date
      })

      if is_overlap? && @params[:allow_overlap] != "true"
        false
      else
        exception_service = Events::ExceptionService.new(handle_event, @params)
        exception_service.perform
        self.event = exception_service.new_event
        true
      end
    end

    private
    def event_params
      @params.require(:event).permit Event::ATTRIBUTES_PARAMS
    end

    def handle_event_params
      @params.require(:event).permit Event::ATTRIBUTES_PARAMS[1..-2]
    end

    def modify_repeat_params
      [:repeat_type, :repeat_every, :start_repeat,
        :end_repeat,:repeat_ons_attributes].each {|attribute| @params[:event].delete attribute}
    end

    def handle_event
      @event.parent? || @params[:persisted].to_i == 1 ? @event : @event.event_parent
    end

    def is_overlap?
      event = Event.new handle_event_params
      event.parent_id = @event.parent? ? @event.id : @event.parent_id
      event.calendar_id = @event.calendar_id

      overlap_handler = OverlapHandler.new(event)
      self.is_overlap = overlap_handler.overlap?
    end
  end
end
