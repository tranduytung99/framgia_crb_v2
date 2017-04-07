class ShareCalendarsController < ApplicationController
  def new
    respond_to do |format|
      format.html do
        render partial: "calendars/user_share",
          locals: {
            id: nil,
            user_id: params[:user_id],
            email: params[:email],
            permission: params[:permission],
            permissions: Permission.all,
            color_id: Color.pluck(:id).sample,
            _destroy: false
          }
      end
    end
  end
end
