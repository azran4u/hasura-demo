import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema    
  .createTable("owners", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.timestamps(true, true); // adds created_at and updated_at
    table.string("name");
    table.integer("age").unsigned();    
  })  
  .createTable("cats", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.timestamps(true, true); // adds created_at and updated_at
      table.string("name").notNullable();
      table.integer("age").unsigned();
      table
        .uuid("ownerId")
        .references("id")
        .inTable("owners")
        .onDelete("SET NULL")
        .index();      
    })
    
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("cats");
  await knex.schema.dropTableIfExists("owners");
}
