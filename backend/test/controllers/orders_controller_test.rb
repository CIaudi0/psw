require "test_helper"

class OrdersControllerTest < ActionDispatch::IntegrationTest
  CHECKOUT = {
    customer: { firstName: "Mario", lastName: "Rossi", email: "mario@example.com" },
    address: { street: "Via Roma 1", city: "Ferrara", zip: "44121" }
  }.freeze

  setup do
    @user = User.create!(email: "mario@example.com", first_name: "Mario", last_name: "Rossi")
    @product = Product.create!(title: "Mouse", price: 10, stock: 5)
    @headers = auth_headers(@user)
  end

  def auth_headers(user)
    token = JWT.encode({ user_id: user.id, exp: 15.minutes.from_now.to_i }, Rails.application.secret_key_base)
    { "Authorization" => "Bearer #{token}" }
  end

  test "POST /orders richiede autenticazione" do
    post "/orders", params: CHECKOUT

    assert_response :unauthorized
    assert_equal [ "Non autenticato" ], JSON.parse(response.body)["errors"]
  end

  test "POST /orders crea l'ordine dal carrello e lo svuota" do
    @user.current_cart.cart_items.create!(product: @product, quantity: 2)

    assert_difference "Order.count", 1 do
      post "/orders", params: CHECKOUT, as: :json, headers: @headers
    end

    assert_response :created
    assert_equal 20, @user.orders.last.total
    assert_equal 3, @product.reload.stock
    assert_empty @user.current_cart.cart_items.reload
  end

  test "POST /orders richiede degli articoli" do
    assert_no_difference "Order.count" do
      post "/orders", params: CHECKOUT, as: :json, headers: @headers
    end

    assert_response :unprocessable_content
  end

  test "POST /orders fallisce senza abbastanza stock" do
    item = @user.current_cart.cart_items.create!(product: @product, quantity: 1)
    @product.update!(stock: 0)

    assert_no_difference "Order.count" do
      post "/orders", params: CHECKOUT, as: :json, headers: @headers
    end

    assert_response :unprocessable_content
    assert_equal 0, @product.reload.stock
    assert CartItem.exists?(item.id)
  end

  test "GET /orders richiede autenticazione" do
    get "/orders"

    assert_response :unauthorized
  end
end
