
export function up(knex) {
    return knex.schema.createTable('product_categories', function (table) {
        table.increments('id');        
        
        table.integer("category_id").unsigned();  
        table.foreign('category_id').references('id').inTable('categories').onDelete("cascade");  
        table.integer("product_id").unsigned();  
        table.foreign('product_id').references('id').inTable('products').onDelete("cascade");  


    });
}


export function down(knex) {
    return knex.schema.dropTable('product_categories');

}
