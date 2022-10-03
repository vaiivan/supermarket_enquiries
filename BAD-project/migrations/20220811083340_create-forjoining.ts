import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable("forjoining");
  if (!hasTable) {
    await knex.raw(`
      create table forjoining(
        id serial PRIMARY KEY,
        product_id int,
        market_id int,
        category_id int,
        brand_id int,
        price decimal,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (market_id) REFERENCES markets(id),
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (brand_id) REFERENCES brands(id))`
    );
  } 
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("forjoining");
}
