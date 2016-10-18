module Events
  class CreateService
    attr_accessor :is_overlap, :event

    def initialize user, params
      @user = user
      @params = params
      @event = user.events.build event_params
    end

    def perform
      init_place if @params[:name_place].present? && event_params[:place_id].blank?
      modify_repeat_params if @params[:repeat].nil?

      return false if (is_overlap? && not_allow_overlap?) || !@event.save

      if @event.is_repeat?
        CalendarService.new(@event, @event.start_repeat, @event.end_repeat)
          .generate_event_delay
      end
      NotificationWorker.perform_async @event.id
      return true
    end

    private
    def event_params
      @params.require(:event).permit Event::ATTRIBUTES_PARAMS
    end

    def init_place
      place = Place.find_by name: @params[:name_place]
      @params[:event][:place_id] = place.try(:id)
    end

    def modify_repeat_params
      [:repeat_type, :repeat_every, :start_repeat, :end_repeat, :repeat_ons_attributes]
        .each {|attribute| @params[:event].delete attribute}
    end

    def is_overlap?
      overlap_handler = OverlapHandler.new @event
      self.is_overlap = overlap_handler.overlap?
    end

    def not_allow_overlap?
      @params["allow_overlap"] != "true"
    end
  end
end
