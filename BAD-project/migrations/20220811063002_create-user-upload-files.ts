import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable("user_uploads");
  if (!hasTable) {
    await knex.schema.createTable("user_uploads", (table) => {
      table.increments();
      table.integer("user_id").notNullable;
      table.foreign("user_id").references("users.id");
      table.text("file_name").notNullable;
      table.text("regonize");
      table.timestamps(false, true);
    });
  } 
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("user_uploads");
}

