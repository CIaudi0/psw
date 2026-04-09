class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  private

  def render_error(messages, status)
    render json: { errors: Array(messages) }, status: status
  end

  def not_found
    render_error "Risorsa non trovata", :not_found
  end
end
