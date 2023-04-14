FROM node:16-bullseye-slim

RUN apt-get update -y

# RUN apt-get install -y libpq-dev g++ make
# RUN apt-get install -y python3
# RUN npm install -g node-gyp

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# RUN node-gyp rebuild -C ./node_modules/argon2
# RUN npm install argon2 --build-from-source

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 4040
CMD ["npm", "run", "start"]
