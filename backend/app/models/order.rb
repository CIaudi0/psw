class Order < ApplicationRecord
  SHIPPING_METHODS = [ "standard", "express" ]

  belongs_to :user
  has_many :order_items, dependent: :destroy

  enum :status, {
    in_lavorazione: "In lavorazione",
    spedito: "Spedito",
    consegnato: "Consegnato"
  }, default: "in_lavorazione", validate: true

  validates :total, numericality: { greater_than_or_equal_to: 0 }
  validates :customer, :address, presence: true
  validates :shipping_method, inclusion: { in: SHIPPING_METHODS }

  def items_count
    count = 0
    order_items.each { |item| count += item.quantity }
    count
  end

  def as_json(options = {})
    {
      id: id,
      status: status,
      total: total.to_f,
      customer: customer,
      address: address,
      shippingMethod: shipping_method,
      createdAt: created_at,
      items: order_items.map { |item| item.as_json }
    }
  end
end
