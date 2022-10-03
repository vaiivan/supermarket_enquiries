import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable("markets");
  if (!hasTable) {
    await knex.schema.createTable("markets", (table) => {
      table.increments();
      table.text("market_name").notNullable;
      table.timestamps(false, true);
    });

    await knex.raw(`
        Insert INTO markets (market_name, created_at, updated_at) values ('PK', now(), now());
        Insert INTO markets (market_name, created_at, updated_at) values ('Zstore', now(), now());
        Insert INTO markets (market_name, created_at, updated_at) values ('Aeon', now(), now());`);
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("markets");
}
