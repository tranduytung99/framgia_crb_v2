class CreatePermissions < ActiveRecord::Migration
  def change
    create_table :permissions do |t|
      t.string :permission
      t.references :user_organization

      t.timestamps null: false
    end
  end
end
