class HomeController < ApplicationController
  skip_before_action :authenticate_user!

  def show
    @user = User.new
  end
end
