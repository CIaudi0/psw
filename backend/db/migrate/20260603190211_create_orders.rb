class CreateOrders < ActiveRecord::Migration[8.1]
  def change
    create_table :orders do |t|
      t.references :user, null: false, foreign_key: true
      t.jsonb :customer, null: false
      t.jsonb :address, null: false
      t.decimal :total, null: false
      t.string :status, null: false, default: "in_lavorazione"
      t.string :shipping_method, null: false, default: "standard"
      t.timestamps
    end
  end
end
