require("dotenv").config();

const { HOST, USER, PASSWORD, DATABASE } = process.env;

export default async () =>
  Promise.resolve({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
  });
