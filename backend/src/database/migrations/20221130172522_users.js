
//  migration para criar a tabela de usuários, onde serão armazenados os dados de todos os usuários do site
export function up(knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments("id");
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.boolean('status').defaultTo('true');
        table.string('image_id').nullable().defaultTo(null);
        table.foreign('image_id').references('id').inTable('images').onDelete("SET NULL");



    });
}


export function down(knex) {
    return knex.schema.dropTable('users');

}