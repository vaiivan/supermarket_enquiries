import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("market_locations");
    if (!hasTable) {
      await knex.schema.createTable("market_locations", (table) => {
        table.increments();
        table.integer("market_id").notNullable;
        table.foreign("market_id").references("markets.id");
        table.text("location").notNullable;
        table.timestamps(false, true);
      });
    } 
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("market_locations");
}
