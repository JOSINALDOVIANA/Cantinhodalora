//  migration para criar a tabela de imagens, onde serão armazenados os dados de todas as imagens do site 
export function up(knex) {
    return knex.schema.createTable('images', function (table) {
        table.string('id').primary();

        table.string('name').notNullable();
        table.string('size').notNullable();
        table.string('key').notNullable();
        table.string('url').notNullable();
        table.boolean('is_product').defaultTo('false');

    


    });
}


export function down(knex) {
    return knex.schema.dropTable('images');

}
