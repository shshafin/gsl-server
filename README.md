# GSL Server

A TypeScript Express backend designed for secure, scalable application APIs with authentication, file handling, validation, and database integration.

## Overview

This server provides the API foundation for the GSL platform and includes:
- user authentication and authorization
- MongoDB integration with Mongoose
- input validation with Zod
- file uploads with Multer and Cloudinary
- email notifications
- cron-based scheduled tasks
- structured logging and error handling

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB + Mongoose
- JWT + bcrypt
- Zod
- Cloudinary
- Nodemailer
- CSV utilities
- Node-cron

## Features

- secure REST API design
- role-aware auth flows
- scalable backend structure
- modular service/controller architecture
- environment-based configuration
- production-ready TypeScript build setup

## Run Locally

```bash
git clone https://github.com/shshafin/gsl-server.git
cd gsl-server
npm install
npm run start:dev
```

## Scripts

```bash
npm run start:dev
npm run build
npm start
npm run lint
npm run lint:fix
npm run prettier:fix
```

## Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Related

- Client: https://github.com/shshafin/gsl-client
- Portfolio: https://shafinsadnan.com

## Author

Shafin Sadnan

GitHub: https://github.com/shshafin
