class HandleTokensController < ApplicationController
  def update
    if current_user.update_attributes user_params
      respond_to do |format|
        format.html {redirect_to root_path}
        format.json {render json: {}}
      end
    else
      respond_to do |format|
        format.html {redirect_to root_path}
        format.json {render json: {}}
      end
    end
  end

  private
  def user_params
    params.require(:user).permit :google_oauth_token
  end
end
