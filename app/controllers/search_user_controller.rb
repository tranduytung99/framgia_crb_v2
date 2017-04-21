class SearchUserController < ApplicationController
  layout "ajax", only: :index

  def index
    @users = SearchUserService.new(params).search
  end
end
