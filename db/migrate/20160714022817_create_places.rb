class CreatePlaces < ActiveRecord::Migration
  def change
    create_table :places do |t|
      t.string :name
      t.string :address
      t.integer :user_id
      t.float :latitude
      t.float :longitude

      t.timestamps null: false
    end

    add_index :places, [:name, :user_id]
  end
end
