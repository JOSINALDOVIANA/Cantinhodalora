/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.alterTable("clients",(table)=>{
    table.string("image_id").defaultTo("null");  
    table.foreign('image_id').references('id').inTable('images');
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
   return knex.schema.alterTable("clients",function(table){
        table.dropForeign("image_id")        
        table.dropColumns(["image_id"]);
})
}
