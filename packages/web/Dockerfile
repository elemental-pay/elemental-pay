#Creates a layer from node:alpine image.
FROM node:alpine

#Creates directories
RUN mkdir -p /usr/src/app

RUN apk add --update --no-cache python3 make g++\
   && rm -rf /var/cache/apk/*

# COPY start.sh /usr/src/app
# COPY build.sh /usr/src/app
# RUN chmod +x /usr/src/app/start.sh /usr/src/app/build.sh

#Sets an environment variable
ENV PORT 3000

#Sets the working directory for any RUN, CMD, ENTRYPOINT, COPY, and ADD commands
WORKDIR /usr/src/app

# RUN chmod +x build.sh

#Copy new files or directories into the filesystem of the container
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

#Execute commands in a new layer on top of the current image and commit the results
RUN npm install

##Copy new files or directories into the filesystem of the container
COPY . /usr/src/app

# ENV APP_ENV
ARG NEXT_PUBLIC_APP_ENV
ENV NEXT_PUBLIC_APP_ENV=${NEXT_PUBLIC_APP_ENV}
# ENV NEXT_PUBLIC_GRAPHQL_API={NEXT_PUBLIC_GRAPHQL_API}
# ENV NEXT_PUBLIC_GRAPHQL_API_STAGING={NEXT_PUBLIC_GRAPHQL_API_STAGING}
# ENV NEXT_PUBLIC_GRAPHQL_API_PRODUCTION={NEXT_PUBLIC_GRAPHQL_API_PRODUCTION}

# ARG STAGE=development
# COPY ./environments/.env.${STAGE}.template .env.production.local
COPY .env.production .env.production
COPY .env.development .env.development
COPY .env.local .env.production

#Execute commands in a new layer on top of the current image and commit the results
# RUN npm run build
RUN chmod 755 build.sh && /usr/src/app/build.sh
RUN chmod 755 start.sh

#Informs container runtime that the container listens on the specified network ports at runtime
EXPOSE 3000

#Allows you to configure a container that will run as an executable
ENTRYPOINT ["/usr/src/app/start.sh"]
