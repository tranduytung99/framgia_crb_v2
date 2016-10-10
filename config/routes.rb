Rails.application.routes.draw do
  get "/api"  => "application#api"

  devise_for :users, controllers: {omniauth_callbacks: "callbacks"}

  authenticated :user do
    root "calendars#index", as: :authenticated_root
  end

  unauthenticated :user do
    root "home#show", as: :unauthenticated_root
  end

  resources :calendars

  resources :users, only: :show do
    resources :calendars do
      resource :destroy_events, only: :destroy
    end
    resources :events, except: [:index] do
      resources :attendees, only: :destroy
    end
  end
  resources :attendees
  resources :events, except: :index
  resources :particular_calendars, only: :show
  get "auth/:provider/callback", to: "google_calendars#create"

  namespace :api do
    resources :places, only: :index
    resources :calendars, only: [:update, :new]
    resources :users, only: :index
    resources :events, except: [:edit, :new]
    resources :request_emails, only: :new
    resources :particular_events, only: [:index, :show]
    get "search" => "searches#index"
    resources :sessions, only: [:create, :destroy]
  end
end
