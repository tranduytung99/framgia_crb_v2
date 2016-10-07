class Api::PlacesController < ApplicationController
  include Authenticable unless :is_desktop_client?

  respond_to :json
  before_action :authenticate_with_token! unless :is_desktop_client?

  def index
    @places = Place.all
    render json: @places
  end
end
