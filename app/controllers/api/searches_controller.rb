class Api::SearchesController < ApplicationController
  def index
    @users = User.search params[:q]
    render json: @users.map{|user| {email: user.email, user_id: user.id}}
  end
end
