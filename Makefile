migrate:
	docker-compose up --build -d 
	docker-compose exec web npx prisma migrate dev
	docker-compose exec web yarn test

up:
	docker-compose up -d

build:
	docker-compose up --build -d
	docker-compose exec web yarn test

down:
	docker-compose down
