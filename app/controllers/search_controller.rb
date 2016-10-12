class SearchController < ApplicationController
  def index
    if params[:name].present? && params[:term].present?
      @places = Place.search_name(params[:term], current_user.id)
      render json: @places.order_by_name
        .map{|place| {name: place.name, place_id: place.id}}
    elsif params[:term].present?
      @users = User.search(params[:term]).order_by_email
      render json: @users.map{|user| {email: user.email, user_id: user.id}}
    end
  end
end
