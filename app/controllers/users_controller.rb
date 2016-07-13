class UsersController < ApplicationController
  load_and_authorize_resource

  def show
    @events = FullcalendarService.new(@user.events).repeat_data
    @events = @events.select{|e| e.start_date > DateTime.now}

    @events = @events.sort_by{|e| e.start_date}
  end
end
