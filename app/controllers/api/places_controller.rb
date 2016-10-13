class Api::PlacesController < Api::BaseController
  respond_to :json

  def index
    @places = Place.all
    render json: @places
  end
end
