/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.alterTable("clients",(table)=>{
        table.dropForeign("image_id");
        
    })
  }
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export function down(knex) {
     return knex.schema.alterTable("clients",function(table){
        table.foreign('image_id').references('id').inTable('images');
  })
  }
  