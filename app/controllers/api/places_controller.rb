class Api::PlacesController < ApplicationController
  include Authenticable

  respond_to :json
  skip_before_action :authenticate_user!
  before_action :authenticate_with_token!

  def index
    @places = Place.all
    render json: @places
  end
end
