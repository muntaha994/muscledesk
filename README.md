# MuscleDesk

A gym management web application built as a DBMS course project, with a Spring Boot backend, a MySQL database and a Next.js frontend.

## Structure
- `gym-backend/`: Spring Boot REST API (Maven)
- `gym-frontend/`: Next.js web app

## Features
- Add, update and delete gym members
- BMI calculator
- Data models for `Member`, `Membership` and `Trainer`

## Tech Stack
- Java, Spring Boot (Maven)
- MySQL (via XAMPP)
- Next.js (React)

## How to Run

**Database**
1. Start MySQL (XAMPP) and create a database named `gym_db`
2. Check `gym-backend/src/main/resources/application.properties` for the port and credentials (default: `localhost:3307`)

**Backend**
```bash
cd gym-backend
./mvnw spring-boot:run
```

**Frontend**
```bash
cd gym-frontend
npm install
npm run dev
```

## 🤝 Team Project

This project was developed as a **team project** for a DBMS course.
