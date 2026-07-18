class Product < ApplicationRecord
  IMAGE_TYPES = [ "image/jpeg", "image/png", "image/webp", "image/gif" ]
  MAX_IMAGE_SIZE = 5.megabytes

  belongs_to :vendor, class_name: "User", optional: true
  has_many :cart_items

  has_one_attached :image

  scope :search, ->(q) { where("LOWER(title) LIKE :q OR LOWER(description) LIKE :q", q: "%#{q.downcase}%") }
  scope :on_sale, -> { where(sale: true) }

  validates :title, presence: true
  validates :price, numericality: { greater_than: 0 }
  validates :original_price, numericality: { greater_than: 0 }, allow_nil: true
  validates :stock, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validate :image_valid

  after_update :update_cart_prices, if: :saved_change_to_price?

  def thumbnail_url
    if image.attached? && ActiveStorage::Current.url_options
      Rails.application.routes.url_helpers.rails_blob_url(image, ActiveStorage::Current.url_options)
    else
      thumbnail
    end
  end

  def as_json(options = {})
    {
      id: id,
      title: title,
      description: description,
      price: price.to_f,
      originalPrice: original_price&.to_f,
      sale: sale,
      thumbnail: thumbnail_url,
      stock: stock,
      vendorId: vendor_id,
      imageAttached: image.attached?,
      createdAt: created_at
    }
  end

  private

  def update_cart_prices
    cart_items.update_all(unit_price: price)
  end

  def image_valid
    return unless image.attached?

    unless IMAGE_TYPES.include?(image.blob.content_type)
      errors.add(:base, "L'immagine deve essere un file JPG, PNG, WebP o GIF")
    end

    if image.blob.byte_size > MAX_IMAGE_SIZE
      errors.add(:base, "L'immagine non può superare 5 MB")
    end
  end
end
