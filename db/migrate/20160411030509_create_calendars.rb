class CreateCalendars < ActiveRecord::Migration
  def change
    create_table :calendars do |t|
      t.references :user
      t.string :name
      t.string :description
      t.references :color, default: 10
      t.integer :status, default: 0
      t.boolean :is_default, default: false

      t.timestamps null: false
    end

    add_index :calendars, :name
  end
end
