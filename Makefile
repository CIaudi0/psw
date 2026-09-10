-include .env

DEV = docker compose -f docker-compose.yml -f docker-compose.dev.yml
PROD = docker compose -f docker-compose.yml -f docker-compose.prod.yml
TEST_DB = postgres://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@db:5432/shop_test

.PHONY: dev prod test test-frontend down logs seed console rails

dev:
	$(DEV) up -d --build

prod:
	$(PROD) up -d --build

test:
	$(DEV) run --rm -e RAILS_ENV=test -e DATABASE_URL=$(TEST_DB) api bash -c "bin/rails db:test:prepare && bin/rails test"

test-frontend:
	$(DEV) exec frontend npx ng test --watch=false

down:
	docker compose down --remove-orphans

logs:
	docker compose logs --tail=200 -f

seed:
	docker compose exec api bin/rails db:seed

console:
	docker compose exec api bin/rails console

rails:
	docker compose exec api bash
