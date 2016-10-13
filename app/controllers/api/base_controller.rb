class Api::BaseController < ApplicationController
  include Authenticable

  skip_before_action :authenticate_user!
  before_action :authenticate_with_token!
end
