class CreateAttendees < ActiveRecord::Migration
  def change
    create_table :attendees do |t|
      t.string :email
      t.references :user
      t.references :event

      t.timestamps null: false
    end
    add_index :attendees, [:email, :event_id], unique: true
  end
end
