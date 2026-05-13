
export function up(knex) {
    return knex.schema.createTable('clients', function (table) {
        table.increments('id');        
        table.string("name");
        table.string("cpf").notNullable();
        table.string("address").notNullable();
        table.string("email").notNullable();
        table.string("password").notNullable();
        table.string("neighborhood").notNullable();
        table.string("city").notNullable();
        table.string("phone").notNullable();
        table.string("birth_date").notNullable();
        table.string("card_number").defaultTo(null);
        table.string("card_expiry").defaultTo(null);
        table.string("cvc").defaultTo(null);
        table.timestamps(true,true,true);
    });
}


export function down(knex) {
    return knex.schema.dropTable('clients');

}
