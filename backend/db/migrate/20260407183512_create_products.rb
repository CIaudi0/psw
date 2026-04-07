class CreateProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :products do |t|
      t.string :title, null: false
      t.text :description
      t.decimal :price, null: false
      t.decimal :original_price
      t.boolean :sale, null: false, default: false
      t.string :thumbnail
      t.integer :stock, null: false, default: 0
      t.timestamps
    end
  end
end
