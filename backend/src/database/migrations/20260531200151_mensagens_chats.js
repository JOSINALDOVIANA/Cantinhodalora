// migrations/20240531_create_mensagens.js
export async function up(knex) {
  await knex.schema.createTable('mensagens', (table) => {
    table.increments('id').primary();
    table.string('usuario', 100).notNullable();
    table.text('conteudo').notNullable();
    table.string('sala', 50).defaultTo('global');
    table.timestamp('criado_em').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTable('mensagens');
}
