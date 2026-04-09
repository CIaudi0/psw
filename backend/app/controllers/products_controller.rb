class ProductsController < ApplicationController
  def index
    page = params[:page].to_i
    page = 1 if page < 1

    per_page = params[:per_page].to_i
    per_page = 12 if per_page < 1
    per_page = 48 if per_page > 48

    products = Product.all
    products = products.search(params[:q]) if params[:q].present?
    products = products.on_sale if params[:sale] == "true"

    total = products.count
    total_pages = (total.to_f / per_page).ceil
    total_pages = 1 if total_pages < 1

    products = products.order(created_at: :desc).offset((page - 1) * per_page).limit(per_page)

    render json: {
      products: products,
      meta: {
        total:      total,
        page:       page,
        perPage:    per_page,
        totalPages: total_pages
      }
    }
  end

  def show
    product = Product.find(params.expect(:id))
    render json: product
  end
end
