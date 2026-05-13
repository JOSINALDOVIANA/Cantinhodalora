
export function up(knex) {
    return knex.schema.createTable('products', function (table) {
        table.increments('id');        
        table.string('description').notNullable();
        table.string('size').notNullable();
        table.integer('price').notNullable().defaultTo(0);         
        table.string('url').notNullable();         
        table.integer('unit').notNullable();
        table.string('image_id').defaultTo("null");//imagem principal para o produto
        table.foreign('image_id').references('id').inTable('images').onDelete("SET NULL");  


    });
}


export function down(knex) {
    return knex.schema.dropTable('products');

}
