
export function up(knex) {
    return knex.schema.createTable('categories', function (table) {
        table.increments('id');        
        table.string('description').notNullable();    


    });
}


export function down(knex) {
    return knex.schema.dropTable('categories');

}
