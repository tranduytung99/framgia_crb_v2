class CreateOrganizations < ActiveRecord::Migration
  def change
    create_table :organizations do |t|
      t.string :name
      t.integer :creator_id
      t.string :logo

      t.timestamps null: false
    end
  end
end
