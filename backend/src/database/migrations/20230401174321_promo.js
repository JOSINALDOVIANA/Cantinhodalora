
// esta migration é para criar a tabela de promoções, onde cada promoção tem um produto associado, uma imagem, um valor promocional e uma nova descrição. A tabela também inclui um timestamp para rastrear quando as promoções são atualizadas.
export function up(knex) {
    return knex.schema.createTable('promotions', function (table) {
        table.increments('id');
        table.integer("product_id").unsigned();
        table.string("image_id");
        table.double("promo_value").notNullable();
        table.string("new_description").notNullable();
        table.foreign('product_id').references('id').inTable('products');
        table.foreign('image_id').references('id').inTable('images');
        table.timestamp('updated_at').defaultTo(knex.fn.now());




    });
}


export function down(knex) {
    return knex.schema.dropTable('promotions');

}