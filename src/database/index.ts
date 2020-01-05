// @ts-ignore
import mysql from "mysql2";
import knex from "knex";
import credentials from "../credentials";

type DatabaseError = {
  code: string;
  fatal: boolean;
  path: string;
  stack: string;
} | null;

export default (async () => {
  const config = await credentials();
  const Query = knex({
    client: "mysql",
    connection: config
  });
  const connection = mysql.createPool({
    ...config,
    queueLimit: 50,
    waitForConnections: true
  });
  const DB = async <T>(str: string) =>
    new Promise((resolve, reject) => {
      connection.execute(str, (err: DatabaseError, result: string, data: T[]) =>
        !!err ? reject(err) : resolve({ data, result })
      );
    });
  return { Query, DB };
})();
