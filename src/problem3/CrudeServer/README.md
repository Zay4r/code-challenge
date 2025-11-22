
# Crude Server

This server is for users who are buying products from a site.


## Features

- User will login and get a token.

- User can find all the products with some filters available.

- User can buy multiple products with desire quentity.

- User can reduce or add some products later.

- User can see what products they have bought and can see total price.

- User can delete some products from record if he dont want anymore.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file.


`DATABASE_URL`

`PORT`

`JWT_SECRET`

`SECRET_KEY`

#### Can also copy from .env.example

## Postman Collection

Postman json is also provided in the repo.



## How to Run 

Clone the project

```bash
  git clone https://github.com/Zay4r/code-challenge.git
```

Go to the project directory

```bash
  cd src/problem3/CrudeServer
```

Install dependencies

```bash
  npm install
```

Have your local MySQL running and create new db

```bash
  CREATE DATABASE crude_server;
```

Run migration for tables
```bash
  npx prisma migrate dev
```

Run generate for prisma 

```bash
  npx prisma generate
```

Seeding

```bash
  npm run seed
```

Start the server

```bash
  npm run dev
```


