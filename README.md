<p align="center">
  <a href="#" target="_blank"> <img src="https://blog.logrocket.com/wp-content/uploads/2020/02/scalable-websockets-nestjs-redis.jpeg" alt="Nest Logo" /></a>
</p>

# todo-micro-service
Simple todo application built in NestJs Micro-service & Dockerize environment
* NestJS
* NestJS Microservice
* TypeORM
* PostgreSQL
* Swagger
* PGadmin4
* JWT
* Docker
* Redis

## Services
* admin-service
* client-service
* redis-server
* db
* pgadmin

# Running the app on docker
## Create DB using docker container
```bash
$ docker-compose exec db createdb DB_NAME -U postgres
```
## Docker build & start
```bash
# docker env build
$ docker-compose build

# docker env start
$ docker-compose up

# remove docker container (services & networks)
$ docker-compose down
```
## Migration

```bash
# generate migration for admin-service & client-service
$ docker-compose run admin-service npm run typeorm:generate AnyNameYouLike
$ docker-compose run client-service npm run typeorm:generate AnyNameYouLike

# run migration
$ docker-compose run admin-service npm run typeorm:run
$ docker-compose run client-service npm run typeorm:run
```
