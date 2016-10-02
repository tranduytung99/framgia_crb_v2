class NotificationEmailJob < Struct.new(:event_id, :attendee_ids, :current_user_id)
  def perform
    attendees = Attendee.joins(:user).where id: self.attendee_ids

    attendees.each do |attendee|
      UserMailer.send_email_notify_delay(self.event_id, attendee.user_id,
        self.current_user_id).deliver
    end
  end
end
