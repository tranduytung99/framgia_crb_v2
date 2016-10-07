class Api::UsersController < ApplicationController
  include Authenticable unless :is_desktop_client?
  before_action :authenticate_with_token! unless :is_desktop_client?

  respond_to :json

  def index
    @users = User.all
    render json: @users
  end
end
