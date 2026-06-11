class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :product

  validates :quantity, numericality: { only_integer: true, greater_than: 0 }
  validates :price, numericality: { greater_than_or_equal_to: 0 }

  def line_total
    price * quantity
  end

  def as_json(options = {})
    {
      id: id,
      productId: product_id,
      quantity: quantity,
      unitPrice: price.to_f,
      lineTotal: line_total.to_f,
      product: product.as_json
    }
  end
end
