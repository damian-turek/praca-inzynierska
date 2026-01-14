# Next.js + Prisma + Docker Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It uses PostgreSQL as a database (via Docker) and Prisma as ORM.

## Getting Started

### 1. Install Node.js
Download and install the latest LTS version of [Node.js](https://nodejs.org/).

### 2. Install dependencies
In the project directory, run:
```bash
npm install
```

### 3. Configure environment variables
Copy the example environment file and fill in your own values:
```bash
cp .env.example .env
# Edit .env if needed (especially DATABASE_URL)
```

### 4. Start the database (PostgreSQL) with Docker
Make sure Docker is installed and running. Then start the database:
```bash
docker compose up -d
```

### 5. Run database migrations
Apply the database schema using Prisma migrations:
```bash
npx prisma migrate deploy
# or for development:
npx prisma migrate dev
```

### 6. (Optional) Seed the database
If you have a seed script, run:
```bash
npx prisma db seed
```

### 7. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## Project Structure
- `docker-compose.yaml` – Docker config for PostgreSQL
- `prisma/` – Prisma schema and migrations
- `.env.example` – Example environment variables
- `src/` – Application source code

---

## Useful Commands
- `docker compose up -d` – Start the database
- `docker compose down` – Stop the database
- `npx prisma migrate deploy` – Apply migrations
- `npm run dev` – Start the Next.js development server

---

## Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Documentation](https://docs.docker.com/)
