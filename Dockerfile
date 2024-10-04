# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.12.2

# Use node image for base image for all stages.
FROM node:${NODE_VERSION} as base

# Sets the working directory inside the container to /app. This is where the application code will be copied and where the container will run from.
WORKDIR /app

# Copies the package.json and package-lock.json files from the current directory on the host machine to the /app directory in the container. The * in package*.json allows us to copy both files at once.
COPY package*.json ./

# Installs the application dependencies in the container. This step uses the npm install command to install the dependencies listed in package.json.
RUN npm install

# Copies the application code from the host machine to the /app directory in the container.
COPY . .

# The npm run build command is used to build the application in the container. This command will typically create a dist folder with the production build of the application.
RUN npm run build

CMD [ "npm", "run", "start:dev" ]
