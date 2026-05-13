

export function up(knex) {
    return knex.schema.createTable('user_images', function (table) {
        table.increments('id');        
        table.string("image_id");  
        table.foreign('image_id').references('id').inTable('images').onDelete("cascade");
        table.integer("user_id").unsigned();
        table.foreign('user_id').references('id').inTable('users').onDelete("cascade");
        table.timestamps(true,true,true);
    });
}


export function down(knex) {
    return knex.schema.dropTable('user_images');

}
