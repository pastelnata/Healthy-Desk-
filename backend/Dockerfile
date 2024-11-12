FROM node:18

# Navigate to directory
WORKDIR /backend

# Install dependancies for python
RUN apt-get update && apt-get install -y python3 python3-pip

# Install dependencies for node
RUN npm install dotenv
RUN npm install -g typescript
RUN npm install sequelize --save
RUN npm install @types/dotenv --save-dev
COPY package*.json ./
RUN npm install

# 4. Copy code
COPY . .

# 5. Compile
RUN npm run build

# 6. Application port
EXPOSE 8000

# 7. Start the server
CMD ["sh", "-c", "npm start & python3 src/config/desk-api.py"]