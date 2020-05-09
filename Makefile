update-shared:
	rsync -a --delete ./shared/ ./services/spotify/shared; \
	rsync -a --delete ./shared/ ./services/users/shared; \
	rsync -a --delete ./shared/ ./services/stations/shared;

update-serverless-db:
	rsync -a --delete ./services/stations/lib/db/ ./serverless/playola-audio-getter/lib/db;
	rsync -a --delete ./services/stations/.sequelizerc ./serverless/playola-audio-getter;

docker-test-all:
	docker-compose run spotify yarn test; \
	docker-compose run spotify yarn lint; \
	docker-compose run users yarn test; \
	docker-compose run users yarn lint; \
	docker-compose run stations yarn test; \
	docker-compose run stations yarn lint;

generate-frontend:
	npx create-react-app services/website

