class ApplicationController < ActionController::API
  before_action :set_current_user

  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  private

  def current_user
    @current_user
  end

  def set_current_user
    @current_user = nil

    header = request.headers["Authorization"]
    return if header.blank?

    token = header.split(" ").last

    begin
      payload = JWT.decode(token, Rails.application.secret_key_base, true, algorithms: [ "HS256" ]).first
      @current_user = User.find_by(id: payload["user_id"])
    rescue JWT::DecodeError
      @current_user = nil
    end
  end

  def authenticate_user!
    if current_user.nil?
      render_error "Non autenticato", :unauthorized
    end
  end

  def build_token(user)
    payload = {
      user_id: user.id,
      email:   user.email,
      role:    user.role,
      exp:     24.hours.from_now.to_i
    }

    JWT.encode(payload, Rails.application.secret_key_base)
  end

  def render_error(messages, status)
    render json: { errors: Array(messages) }, status: status
  end

  def not_found
    render_error "Risorsa non trovata", :not_found
  end
end
