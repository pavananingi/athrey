FROM node:16.14

#Create app directory
WORKDIR /usr/src/app

#Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

#Install dependencies
RUN npm install

#Install additional packages
RUN npm install bcrypt@latest

#Copy the entire application, including the src folder and all files
COPY . .

#Expose port 3000
EXPOSE 3000

#Start the application
CMD ["npm", "start"]