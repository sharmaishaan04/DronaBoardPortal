# DronaBoardPortal - DRDO ION Document Portal

A secure full-stack document upload and management portal developed for DRDO/DRDE Gwalior. This portal supports role-based access, file uploads with attachments, division-level organization, and an admin panel. Deployed on DRDO’s intranet server (DRONA), the system enables seamless document operations within a controlled environment.

## Features

-  Upload documents with **two attachments** (max 5MB each)
-  **Role-based access control** (Guest, User, Admin)
  - **Guest**: View all uploaded documents
  - **User**: Upload documents for the current date
  - **Admin**: Full access — Upload/Edit/Delete any document, manage users and divisions
-  **Authentication using JWT**
  - Access & Refresh token system
-  **Admin Panel**
  - Create/manage users
  - Create/edit/delete divisions or departments
-  **Search & Filter**
  - Search documents by date, title, division, or type
-  Fully responsive UI

## Tech Stack

### Frontend
- React.js
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Prisma ORM

### Database
- MySQL

### Other Tools
- Multer (for file uploads)
- JWT (authentication)
- DRONA (intranet deployment)

### Deployment
Deployed on DRONA — DRDO’s secure intranet server.

### Author
Ishaan Sharma
📧 ishaan401004@gmail.com

This project is proprietary to DRDO/DRDE and should not be redistributed without proper authorization.
