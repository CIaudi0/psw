require "test_helper"

class ProductTest < ActiveSupport::TestCase
  test "salva un prodotto valido" do
    product = Product.new(
      title: "Tastiera Meccanica",
      description: "tastiera",
      price: 120.50
    )
    assert product.save, "non è riuscito a salvare un prodotto valido"
  end

  test "non salva senza titolo" do
    product = Product.new(price: 10.0)
    assert_not product.save, "salvato il prodotto senza titolo"
  end
end
