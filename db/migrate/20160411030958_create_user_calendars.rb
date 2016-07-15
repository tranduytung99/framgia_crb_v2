class CreateUserCalendars < ActiveRecord::Migration
  def change
    create_table :user_calendars do |t|
      t.references :user
      t.references :calendar
      t.references :permission
      t.references :color

      t.timestamps null: false
    end
    add_index :user_calendars, [:user_id, :calendar_id], unique: true
  end
end
