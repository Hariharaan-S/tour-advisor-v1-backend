FROM node:21

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 5000

ENV JWT_SECRET=TourAdvisorSecretKey
ENV MONGODB_URI=mongodb://applicationAdminUser:tourAdvisor2026@mongodb:27017/tour_advisor?authSource=admin


CMD ["npm", "start"]