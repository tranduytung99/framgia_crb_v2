class CreateWorkspaces < ActiveRecord::Migration[5.0]
  def change
    create_table :workspaces do |t|
      t.string :name
      t.string :address
      t.string :logo
      t.integer :organization_id

      t.timestamps
    end

    add_index :workspaces, :organization_id
  end
end
