class ResultSearchPresenter
  attr_accessor :room_name, :calendar, :start_date, :finish_date

  def initialize type, calendar, start_date, finish_date
    @room_name = calendar.name + (type == :suggest ? I18n.t("room_search.suggest_label") : "")
    @calendar = calendar
    @start_date = start_date
    @finish_date = finish_date
  end

  def encode_event_params
    Base64.urlsafe_encode64({
      calendar_id: @calendar.id,
      start_date: @start_date,
      finish_date: @finish_date
    }.to_json)
  end
end
