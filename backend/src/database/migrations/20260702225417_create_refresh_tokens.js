export function up(knex) {
  return knex.schema.createTable('refresh_tokens', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');
    table.string('token',2048).notNullable();
    table.boolean('is_valid').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('expires_at').notNullable();
  });
};

export function down(knex) {
  return knex.schema.dropTable('refresh_tokens');
};