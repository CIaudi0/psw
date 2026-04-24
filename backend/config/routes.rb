Rails.application.routes.draw do
  get     "/auth/me",                      to: "users#me"
  get     "/auth/google_oauth2/callback",  to: "callbacks#google_oauth2"

  get "up" => "rails/health#show", as: :rails_health_check

  defaults format: :json do
    resources :products, only: [ :index, :show ]
  end
end
