class CartItem < ApplicationRecord
  belongs_to :cart
  belongs_to :product

  before_validation :set_unit_price

  validates :quantity, numericality: { only_integer: true, greater_than: 0 }
  validates :unit_price, numericality: { greater_than: 0 }
  validates :product_id, uniqueness: { scope: :cart_id }

  def as_json(options = {})
    {
      id: id,
      productId: product_id,
      quantity: quantity,
      unitPrice: unit_price.to_f,
      product: product.as_json
    }
  end

  private

  def set_unit_price
    if product
      self.unit_price = product.price
    end
  end
end
