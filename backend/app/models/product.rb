class Product < ApplicationRecord
  scope :search, ->(q) { where("LOWER(title) LIKE :q OR LOWER(description) LIKE :q", q: "%#{q.downcase}%") }
  scope :on_sale, -> { where(sale: true) }

  validates :title, presence: true
  validates :price, numericality: { greater_than: 0 }
  validates :original_price, numericality: { greater_than: 0 }, allow_nil: true
  validates :stock, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  def as_json(options = {})
    {
      id: id,
      title: title,
      description: description,
      price: price.to_f,
      originalPrice: original_price&.to_f,
      sale: sale,
      thumbnail: thumbnail,
      stock: stock,
      createdAt: created_at
    }
  end
end
