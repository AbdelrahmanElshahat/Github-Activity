FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

# Set environment variables to disable strict CI mode
ENV CI=false
ENV GENERATE_SOURCEMAP=false

EXPOSE 3000

CMD ["npm", "start"]