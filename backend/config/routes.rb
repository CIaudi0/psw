Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  defaults format: :json do
    resources :products, only: [ :index, :show ]
  end
end
