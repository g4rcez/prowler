//@ts-ignore
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

  const connector = knex({
    client: "mysql",
    connection: config
  });

  const connection = mysql.createPool({
    ...config,
    queueLimit: 50,
    waitForConnections: true
  });

  const query = async <T>(str: string) =>
    new Promise((resolve, reject) => {
      connection.execute(
        str,
        (err: DatabaseError, result: string, fields: T[]) => {
          if (!!err) {
            return reject(err);
          }
          return resolve({ data: fields, result });
        }
      );
    });
  return {
    Query: connector,
    DB: query
  };
})();
