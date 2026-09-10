class ApplicationController < ActionController::API
  before_action :set_current_user
  before_action :set_active_storage_url_options

  rescue_from StandardError, with: :internal_error
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActionController::ParameterMissing, with: :bad_request

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

  def require_admin!
    if current_user.nil? || !current_user.admin?
      render_error "Accesso negato: Solo Admin", :forbidden
    end
  end

  def require_vendor!
    if current_user.nil? || !(current_user.vendor? || current_user.admin?)
      render_error "Accesso negato: Solo Venditori", :forbidden
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

  def set_active_storage_url_options
    ActiveStorage::Current.url_options = { protocol: request.protocol, host: request.host, port: request.port }
  end

  def render_error(messages, status)
    render json: { errors: Array(messages) }, status: status
  end

  def bad_request(exception)
    render_error "Parametro mancante: #{exception.param}", :bad_request
  end

  def not_found
    render_error "Risorsa non trovata", :not_found
  end

  def internal_error(exception)
    Rails.logger.error(exception.full_message)
    render_error "Errore interno del server", :internal_server_error
  end
end
