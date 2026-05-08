class CartsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_cart

  def show
    render_cart
  end

  def add_item
    product = Product.find_by(id: params[:productId])
    return render_error "Prodotto non trovato", :not_found if product.nil?

    quantity = (params[:quantity] || 1).to_i
    return render_error "Quantità non valida", :unprocessable_content if quantity < 1

    cart_item = @cart.cart_items.find_by(product_id: product.id)
    if cart_item.nil?
      cart_item = @cart.cart_items.new(product: product, quantity: 0)
    end

    new_quantity = cart_item.quantity + quantity

    if new_quantity > product.stock
      return render_error "Stock esaurito (disponibili: #{product.stock})", :unprocessable_content
    end

    cart_item.quantity = new_quantity

    if cart_item.save
      render_cart :created
    else
      render_error cart_item.errors.full_messages, :unprocessable_content
    end
  end

  def update_item
    cart_item = @cart.cart_items.find(params[:id])

    new_quantity = params[:quantity].to_i
    return render_error "Quantità non valida", :unprocessable_content if new_quantity < 1

    if new_quantity > cart_item.product.stock
      return render_error "Stock insufficiente (disponibili: #{cart_item.product.stock})", :unprocessable_content
    end

    cart_item.update!(quantity: new_quantity)
    render_cart
  end

  def remove_item
    cart_item = @cart.cart_items.find(params[:id])
    cart_item.destroy
    head :no_content
  end

  def sync
    items = params.require(:items)

    items.each do |item|
      product = Product.find_by(id: item[:productId])
      next if product.nil?

      cart_item = @cart.cart_items.find_by(product_id: product.id)
      if cart_item.nil?
        cart_item = @cart.cart_items.new(product: product, quantity: 0)
      end

      new_quantity = cart_item.quantity + item[:quantity].to_i
      new_quantity = product.stock if new_quantity > product.stock

      if new_quantity > 0
        cart_item.quantity = new_quantity
        cart_item.save!
      end
    end

    render_cart
  end

  private

  def set_cart
    @cart = current_user.current_cart
  end

  def render_cart(status = :ok)
    cart = Cart.includes(cart_items: :product).find(@cart.id)
    render json: cart, status: status
  end
end
