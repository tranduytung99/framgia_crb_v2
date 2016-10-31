class UsersController < ApplicationController
  load_and_authorize_resource

  def show
    resource.setting || resource.build_setting
  end
end
