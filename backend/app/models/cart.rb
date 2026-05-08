class Cart < ApplicationRecord
  belongs_to :user
  has_many :cart_items, -> { order(:id) }, dependent: :destroy

  def total
    sum = 0
    cart_items.each { |item| sum += item.unit_price * item.quantity }
    sum
  end

  def items_count
    count = 0
    cart_items.each { |item| count += item.quantity }
    count
  end

  def as_json(options = {})
    {
      id: id,
      items: cart_items.map { |item| item.as_json },
      total: total.to_f,
      count: items_count
    }
  end
end
