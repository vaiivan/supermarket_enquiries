// -------------------------------------------------------------------------------------------------------------------
// imports
// -------------------------------------------------------------------------------------------------------------------

import { Knex } from "knex";

// -------------------------------------------------------------------------------------------------------------------
// user services
// -------------------------------------------------------------------------------------------------------------------

export class InquiryService {
  constructor(private knex: Knex) {}

  // -------------------------------------------------------------------------------------------------------------------
  // find all categories
  // -------------------------------------------------------------------------------------------------------------------

  async getCategories() {
    //get the info
    const result = await this.knex
      .select("category_name", "id")
      .from("categories");
    return { categories: result };
  }

  // -------------------------------------------------------------------------------------------------------------------
  // search for products
  // -------------------------------------------------------------------------------------------------------------------

  async searchProducts(query: string) {
    const search = await this.knex.raw(
      `select product_name,brand_name,market_name,price from products inner join forjoining on products.id = forjoining.product_id inner join brands on forjoining.brand_id = brands.id inner join markets on forjoining.market_id = markets.id where product_name ilike ? or brand_name ilike ? order by product_name;`,
      ["%" + query + "%", "%" + query + "%"]
    );
    return { search: search };
  }

  async searchDrinks() {
    const soft_drinks = await this.knex.raw(
      `select product_name,brand_name,price,market_name from products inner join forjoining on products.id = forjoining.product_id inner join brands on forjoining.brand_id = brands.id inner join categories on forjoining.category_id = categories.id inner join markets on forjoining.market_id = markets.id where category_name = 'drinks' order by product_name;`
    );
    return { soft_drinks: soft_drinks };
  }

  async searchBeers() {
    const beers = await this.knex.raw(
      `select product_name,brand_name,price,market_name from products inner join forjoining on products.id = forjoining.product_id inner join brands on forjoining.brand_id = brands.id inner join categories on forjoining.category_id = categories.id inner join markets on forjoining.market_id = markets.id where category_name = 'beer' order by product_name;`
    );
    return { beers: beers };
  }

  async searchSnacks() {
    const snacks = await this.knex.raw(
      `select product_name,brand_name,price,market_name from products inner join forjoining on products.id = forjoining.product_id inner join brands on forjoining.brand_id = brands.id inner join categories on forjoining.category_id = categories.id inner join markets on forjoining.market_id = markets.id where category_name = 'snacks' order by product_name;`
    );
    return { snacks: snacks };
  }
}
