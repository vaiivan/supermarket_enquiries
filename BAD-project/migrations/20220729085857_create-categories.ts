import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("categories");
    if (!hasTable) {
      await knex.schema.createTable("categories", (table) => {
        table.increments();
        table.text("category_name").notNullable;
        table.timestamps(false, true);
      });

      await knex.raw(`
        Insert INTO categories (category_name, created_at, updated_at) values ('drinks', now(), now());`);

        await knex.raw(`
        Insert INTO categories (category_name, created_at, updated_at) values ('snacks', now(), now());`);

        await knex.raw(`
        Insert INTO categories (category_name, created_at, updated_at) values ('beer', now(), now());`);
    } 

    
  }


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("categories");
}

