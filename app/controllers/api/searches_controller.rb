class Api::SearchesController < ApplicationController
  def index
    @users = User.search(params[:term]).order_by_email
    render json: @users.map{|user| {email: user.email, user_id: user.id}}
  end
end
