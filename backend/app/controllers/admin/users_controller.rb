class Admin::UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :require_admin!

  def index
    users = User.order(:email)
    render json: users
  end

  def update
    user = User.find(params[:id])

    if user.id == current_user.id
      return render_error "Non puoi modificare il tuo ruolo", :forbidden
    end

    unless User.roles.key?(params[:role])
      return render_error "Ruolo non valido: #{params[:role]}", :unprocessable_content
    end

    if user.update(role: params[:role])
      render json: {
        message: "Ruolo aggiornato",
        user: user
      }
    else
      render_error user.errors.full_messages, :unprocessable_content
    end
  end

  def destroy
    user = User.find(params[:id])

    if user.id == current_user.id
      return render_error "Non puoi eliminare il tuo account", :forbidden
    end

    user.destroy
    render json: { message: "Utente eliminato" }
  end
end
