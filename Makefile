-include .env

DEV = docker compose -f docker-compose.yml -f docker-compose.dev.yml
PROD = docker compose -f docker-compose.yml -f docker-compose.prod.yml

.PHONY: dev prod down logs seed console rails

dev:
	$(DEV) up -d --build

prod:
	$(PROD) up -d --build

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
