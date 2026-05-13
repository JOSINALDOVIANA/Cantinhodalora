

export function up(knex) {
    return knex.schema.createTable('client_images', function (table) {
        table.increments('id');        
        table.string("image_id");  
        table.foreign('image_id').references('id').inTable('images').onDelete("cascade");
        table.integer("client_id").unsigned();
        table.foreign('client_id').references('id').inTable('clients').onDelete("cascade");
        table.timestamps(true,true,true);
    });
}


export function down(knex) {
    return knex.schema.dropTable('client_images');

}
