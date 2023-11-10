up:
	docker compose -f docker-compose.dev.yaml up --build -d

down:
	docker compose -f docker-compose.dev.yaml down

run:
	docker compose -f docker-compose.dev.yaml up --build

build:
	docker compose -f docker-compose.dev.yaml build

create_test:
	node ./scripts/create_test.js

cli:
	docker exec -it monkeyradio-api /bin/bash

migrate:
	docker exec -it monkeyradio-api npx migrate up -a true