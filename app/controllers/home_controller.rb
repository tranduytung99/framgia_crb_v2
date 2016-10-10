class HomeController < ApplicationController
  skip_before_action :authenticate_user!
  helper_method :resource_name, :resource, :devise_mapping, :resource_class

  def show
  end

  def resource_name
    :user
  end

  def resource
    @resource ||= User.new
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end

  def resource_class
    User
  end
end
