class CreateSettings < ActiveRecord::Migration
  def change
    create_table :settings do |t|
      t.integer :timezone
      t.string :timezone_name
      t.string :country
      t.string :default_view, null: false, default: :scheduler
      t.integer :user_id
      t.timestamps null: false
    end

    add_index :settings, :user_id
  end
end
