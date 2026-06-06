// migrations/20240531_create_mensagens.js
export async function up(knex) {
  await knex.schema.createTable('wifi_configs', (table) => {
    table.increments('id').primary();
    table.string('ssid', 100).notNullable();
    table.string('password', 100).notNullable();
    table.string('encryption', 50).defaultTo('WPA');
    table.timestamp('criado_em').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTable('wifi_configs');
}
