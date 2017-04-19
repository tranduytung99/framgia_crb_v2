class UsersController < ApplicationController
  load_and_authorize_resource find_by: :slug

  def show
    resource.setting || resource.build_setting
  end
end
