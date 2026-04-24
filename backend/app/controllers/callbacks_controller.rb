class CallbacksController < ApplicationController
  def google_oauth2
    auth = request.env["omniauth.auth"]
    frontend_url = ENV.fetch("FRONTEND_URL", "http://localhost:4200")

    user = User.find_by(email: auth.info.email)

    if user.nil?
      user = User.create!(
        email:      auth.info.email,
        first_name: auth.info.first_name,
        last_name:  auth.info.last_name
      )
    end

    redirect_to "#{frontend_url}/login/success?token=#{build_token(user)}", allow_other_host: true
  end
end
