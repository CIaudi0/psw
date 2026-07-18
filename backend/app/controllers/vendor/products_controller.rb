class Vendor::ProductsController < ApplicationController
  before_action :authenticate_user!
  before_action :require_vendor!
  before_action :set_own_product, only: [ :update, :destroy ]

  def create
    product = current_user.products.new(product_params)

    if product.save
      render json: product, status: :created
    else
      render_error product.errors.full_messages, :unprocessable_content
    end
  end

  def update
    if @product.update(product_params)
      if remove_image?
        @product.image.purge
      end
      render json: @product
    else
      render_error @product.errors.full_messages, :unprocessable_content
    end
  end

  def destroy
    if @product.destroy
      head :no_content
    else
      render_error @product.errors.full_messages, :unprocessable_content
    end
  end

  private

  def set_own_product
    if current_user.admin?
      @product = Product.find_by(id: params[:id])
    else
      @product = current_user.products.find_by(id: params[:id])
    end

    if @product.nil?
      render_error "Prodotto non trovato o accesso non autorizzato", :forbidden
    end
  end

  def product_params
    params.expect(product: [ :title, :description, :price, :original_price, :sale, :thumbnail, :stock, :image ])
  end

  def remove_image?
    params[:product][:remove_image] == "true" && params[:product][:image].blank?
  end
end
