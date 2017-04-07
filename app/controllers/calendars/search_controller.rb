class Calendars::SearchController < ApplicationController
  def show
    respond_to do |format|
      format.html
      format.json do
        room_search = RoomSearchService.new current_user, params

        if room_search.valid?
          render json: {results: room_search.perform}
        else
          render json: {error: room_search.errors.messages}, status: 422
        end
      end
    end
  end
end
