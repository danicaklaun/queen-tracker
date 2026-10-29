\# Queen Tracker



Queen Tracker is a full-stack web application for managing beekeeping operations, including beehives, queen bees, hive assignments, and queen quality assessments.



\## Features



\- User authentication and role-based access control

\- Beehive and queen bee management

\- Queen-to-hive assignments

\- Queen quality assessments and recommendations

\- Dashboard with statistics and alerts

\- MySQL master–replica database configuration



\## Tech Stack



\*\*Frontend:\*\* React, TypeScript, Vite  

\*\*Backend:\*\* Node.js, Express, TypeScript  

\*\*Database:\*\* MySQL  

\*\*Infrastructure:\*\* Docker Compose



\## Project Structure



\- `client/` — frontend application

\- `server/` — backend API and business logic

\- `docker/` — MySQL configuration and database scripts

\- `docker-compose.yml` — database services and networking



\## Local Configuration



The backend requires environment variables for database connections and JWT authentication. Create a local `.env` file inside `server/` using `server/.env.example` as a template.



Database credentials in the development configuration are for local use only and must not be used in production.



\## Purpose



This project demonstrates full-stack application development, REST API design, relational database integration, authentication, and a Docker-based MySQL replication setup.



