// Update with your config settings.
import * as Knex from "knex";
declare type KnexConfig = Knex.Knex.Config;

const knexfile: Record<string, KnexConfig> = {
  development: {
    client: "postgresql",
    connection: {
      host: "172.24.0.2",
      database: "postgres",
      user: "postgres",
      password: "postgrespassword",
    },
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  }
};

module.exports = knexfile;
