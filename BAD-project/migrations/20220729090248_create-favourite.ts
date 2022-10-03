import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable("favourite");
  if (!hasTable) {
    await knex.schema.createTable("favourite", (table) => {
      table.increments();
      table.integer("user_id").notNullable;
      table.foreign("user_id").references("users.id");
      table.integer("product_id").notNullable;
      table.foreign("product_id").references("products.id");
      table.timestamps(false, true);
    });
  } 
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("favourite");
}
