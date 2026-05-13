// migration para criar a tabela de relacionamento entre usuários e produtos
export function up(knex) {
    return knex.schema.createTable('user_product', function (table) {
        table.increments('id').primary();

        table.integer('user_id').unsigned(); 
        table.integer('product_id').unsigned(); 

        table.timestamps(true, true);

        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
    });
}

export function down(knex) {
    return knex.schema.dropTable('user_product');
}
