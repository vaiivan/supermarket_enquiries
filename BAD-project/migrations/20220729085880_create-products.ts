import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("products");
    if (!hasTable) {
      await knex.schema.createTable("products", (table) => {
        table.increments();
        table.text("product_name").notNullable;
        
        table.timestamps(false, true);
      });
    } 
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("products");
}
