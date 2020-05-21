FROM node:10.16.3-slim

# Create new user
WORKDIR /usr/src/app

COPY package.json yarn.* /usr/src/app/

RUN npm install -g yarn

# env-cmd and sequelize at the command-line for
# easier development
RUN yarn global add env-cmd sequelize-cli
    
RUN yarn install
