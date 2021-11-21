// Note this config is only used for seeding
const seedingOrm = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'user_tetrapak',
    password: 123456,
    database: 'tetrapak_vindija',
    entities: ['src/**/*.entity{.ts,.js}'],
    seeds: ['src/**/main.seed{.ts,.js}'],
    factories: ['src/**/*.factory{.ts,.js}'],
  };
  
  module.exports = {
    ...seedingOrm,
  };
  