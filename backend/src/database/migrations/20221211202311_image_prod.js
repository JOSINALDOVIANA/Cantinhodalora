
export function up(knex) {
    return knex.schema.createTable('product_images', function (table) {
        table.increments("id");
        
        table.string('image_id').defaultTo("null");
        table.foreign('image_id').references('id').inTable('images').onDelete("cascade");       
        table.integer("product_id").unsigned();        
        table.foreign("product_id").references("id").inTable("products").onDelete("cascade");         
        


    });
}


export function down(knex) {
    return knex.schema.dropTable('product_images');

}