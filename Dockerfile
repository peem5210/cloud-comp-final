# pull official base image
FROM node:alpine
WORKDIR '/frontend'
COPY /frontend/package*.json /frontend
RUN npm install 
COPY /frontend /frontend
EXPOSE 3000
CMD ["npm", "start"]