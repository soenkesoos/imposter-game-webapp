# Use the official Node.js image as the build environment
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use Nginx to serve the app in the production stage
FROM nginx:1.25

COPY --from=build /app/build /usr/share/nginx/html

# Copy the template and entrypoint script
COPY nginx.template.conf /etc/nginx/nginx.template.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh

ENV PORT=80
EXPOSE 80

# Set the entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
