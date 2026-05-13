export default {
  production: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'Wikazako@123',
      database: 'quiosque',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations',
    },
    seeds: {
      directory: './src/database/seeds',
    },
    pool: {
      min: 0,
      max: 10,
      acquireTimeoutMillis: 60000, // 1 minute
      createTimeoutMillis: 60000, // 1 minute
      destroyTimeoutMillis: 60000, // 1 minute
    },
    debug: false, // Enable debug mode
    log: {
      warn(message) {
        console.warn('Knex warning:', message);
      },
      deprecate(message) {
        console.warn('Knex deprecation warning:', message);
      },
      debug(message) {
        console.log('Knex debug:', message);
      },
    },
    afterCreate: (conn, done) => {
      conn.query('SET time_zone = "+00:00";', (err) => {
        if (err) {
          console.error('Error setting timezone:', err);
        }
        done(err, conn);
      });
    },
    beforeDestroy: (conn, done) => {
      conn.query('SET time_zone = "+00:00";', (err) => {
        if (err) {
          console.error('Error resetting timezone:', err);
        }
        done(err, conn);
      });
    },
    acquireConnectionTimeout: 60000, // 1 minute
    createTimeout: 60000, // 1 minute
    destroyTimeout: 60000, // 1 minute
    connectionTimeout: 60000, // 1 minute
    poolSize: 10, // Number of connections in the pool
    idleTimeoutMillis: 60000, // 1 minute
    createRetryInterval: 1000, // 1 second
    createRetryCount: 3, // Number of retries for creating a connection
    destroyRetryInterval: 1000, // 1 second
    destroyRetryCount: 3, // Number of retries for destroying a connection
    acquireRetryInterval: 1000, // 1 second
    acquireRetryCount: 3, // Number of retries for acquiring a connection
    acquireRetryTimeout: 60000, // 1 minute
    acquireRetryDelay: 1000, // 1 second
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user: 'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3' // caminho para o arquivo do banco
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations',
    },
    seeds: {
      directory: './src/database/seeds',
    },
    useNullAsDefault: true // recomendado para SQLite
  }
};