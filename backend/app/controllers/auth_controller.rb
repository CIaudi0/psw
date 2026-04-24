class AuthController < ApplicationController
  rate_limit to: 10, within: 1.minute, only: [ :login, :register ]

  def register
    user = User.new(register_params)
    user.provider = :local

    if user.save
      render json: { token: issue_tokens(user) }, status: :created
    else
      render_error user.errors.full_messages, :unprocessable_entity
    end
  end

  def login
    user = User.find_by(email: params[:email].to_s.strip.downcase)

    if user && user.local? && user.authenticate(params[:password].to_s)
      render json: { token: issue_tokens(user) }
    else
      render_error "Credenziali non valide", :unauthorized
    end
  end

  private

  def register_params
    params.permit(:email, :password, :first_name, :last_name, :street, :city, :zip)
  end
end
