require "test_helper"

class OrderTest < ActiveSupport::TestCase
  def valid_order(attributes = {})
    Order.new({
      user: User.new(email: "mario@example.com"),
      total: 10,
      customer: { firstName: "Mario" },
      address: { city: "Ferrara" }
    }.merge(attributes))
  end

  test "un ordine valido viene accettato" do
    assert valid_order.valid?
  end

  test "totale non può essere negativo" do
    assert_not valid_order(total: -1).valid?
  end

  test "cliente e indirizzo obbligatori" do
    order = valid_order(customer: nil, address: nil)

    assert_not order.valid?
    assert_includes order.errors.attribute_names, :customer
    assert_includes order.errors.attribute_names, :address
  end
end
