class SessionsController < Devise::SessionsController
  respond_to :json

  def create
    session["user_auth"] = params[:user]

    if request.xhr?
      resource = warden.authenticate!(scope: resource_name, recall: "#{controller_path}#failure")
      message = I18n.t "devise.sessions.signed_in"
      sign_in(resource_name, resource)
      render json: {success: true, login: true, data: {message: message}}
    else
      respond_with resource, location: after_sign_in_path_for(resource)
    end

    yield resource if block_given?
  end

  def failure
    message = I18n.t "devise.failure.invalid", authentication_keys: "email"
    respond_to do |format|
      format.json do
        render json: {success: false, data: {message: message, cause: "invalid"}}
      end
      format.html{redirect_to root_path}
    end
  end
end
