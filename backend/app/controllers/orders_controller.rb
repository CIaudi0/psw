class OrdersController < ApplicationController
  before_action :authenticate_user!

  def index
    orders = current_user.orders.includes(:order_items, :user).order(created_at: :desc)

    if params[:status].present?
      unless Order.statuses.key?(params[:status])
        return render_error "Stato non valido: #{params[:status]}", :unprocessable_content
      end
      orders = orders.where(status: params[:status])
    end

    if params[:from].present?
      from = parse_date(params[:from])
      return render_error "Data non valida (formato atteso: AAAA-MM-GG)", :bad_request if from.nil?
      orders = orders.where("orders.created_at >= ?", from.beginning_of_day)
    end

    if params[:to].present?
      to = parse_date(params[:to])
      return render_error "Data non valida (formato atteso: AAAA-MM-GG)", :bad_request if to.nil?
      orders = orders.where("orders.created_at <= ?", to.end_of_day)
    end

    result = orders.map do |order|
      {
        id: order.id,
        createdAt: order.created_at,
        status: order.status,
        total: order.total.to_f,
        shippingMethod: order.shipping_method,
        itemsCount: order.items_count,
        userEmail: order.user.email
      }
    end

    render json: result
  end

  def show
    order = current_user.orders.includes(order_items: :product).find(params[:id])
    render json: order
  end

  def create
    cart = current_user.current_cart
    cart_items = cart.cart_items.includes(:product)

    return render_error "Il carrello è vuoto", :unprocessable_content if cart_items.empty?

    errors = validate_order_params
    return render_error errors, :unprocessable_content if errors.any?

    cart_items.each do |item|
      product = item.product
      if product.stock < item.quantity
        return render_error "Stock insufficiente per '#{product.title}' (disponibili: #{product.stock})", :unprocessable_content
      end
    end

    total = cart.total

    order = nil

    ActiveRecord::Base.transaction do
      order = current_user.orders.create!(
        customer: params.expect(customer: [ :firstName, :lastName, :email ]).to_h,
        address: params.expect(address: [ :street, :city, :zip ]).to_h,
        shipping_method: params[:shippingMethod].presence || "standard",
        total: total
      )

      cart_items.each do |item|
        product = item.product
        order.order_items.create!(product: product, quantity: item.quantity, price: item.unit_price)
        product.update!(stock: product.stock - item.quantity)
      end

      cart_items.destroy_all
    end

    render json: Order.includes(order_items: :product).find(order.id), status: :created
  rescue ActiveRecord::RecordInvalid => e
    render_error e.record.errors.full_messages, :unprocessable_content
  end

  private

  def parse_date(value)
    Date.iso8601(value.to_s)
  rescue Date::Error
    nil
  end

  def validate_order_params
    errors = []
    customer = params[:customer]
    address = params[:address]

    errors << "Nome cliente mancante"    if customer.blank? || customer[:firstName].blank?
    errors << "Cognome cliente mancante" if customer.blank? || customer[:lastName].blank?
    errors << "Email cliente mancante"   if customer.blank? || customer[:email].blank?
    errors << "Via mancante"             if address.blank? || address[:street].blank?
    errors << "Città mancante"           if address.blank? || address[:city].blank?
    errors << "CAP mancante"             if address.blank? || address[:zip].blank?

    errors
  end
end
