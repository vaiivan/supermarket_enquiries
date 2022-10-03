import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("brands");
    if (!hasTable) {
      await knex.schema.createTable("brands", (table) => {
        table.increments();
        table.text("brand_name").notNullable;
        table.timestamps(false, true);
      });
      
      await knex.raw(`
        Insert INTO brands (brand_name, created_at, updated_at) values ('-', now(), now());`);
    } 
    
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("brands");
}

