class Api::UsersController < ApplicationController
  include Authenticable

  respond_to :json
  skip_before_action :authenticate_user!
  before_action :authenticate_with_token!

  def index
    @users = User.all
    render json: @users
  end
end
