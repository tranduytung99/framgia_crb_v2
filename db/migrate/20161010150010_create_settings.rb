class CreateSettings < ActiveRecord::Migration
  def change
    create_table :settings do |t|
      t.string :timezone
      t.string :country
      t.string :default_view
      t.integer :user_id
      t.timestamps null: false
    end

    add_index :settings, :user_id
  end
end
