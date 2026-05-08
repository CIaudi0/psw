class User < ApplicationRecord
  enum :role, { user: "user", admin: "admin", vendor: "vendor" }

  has_one :cart, dependent: :destroy

  before_validation :normalize_email

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  def current_cart
    cart || create_cart!
  end

  def as_json(options = {})
    {
      id: id,
      email: email,
      role: role,
      firstName: first_name,
      lastName: last_name
    }
  end

  private

  def normalize_email
    if email
      self.email = email.strip.downcase
    end
  end
end
