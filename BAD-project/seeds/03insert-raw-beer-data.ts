import { Knex } from "knex";
import xlsx from "xlsx";
import { logger } from "../main/utilities/logger";

//-------------------------------------------------------------------------------------------
// Settings
//-------------------------------------------------------------------------------------------

interface Product {
  product_name: string;
  description: string;
  brand: string;
  price: number;
  market: string;
  category: string;
}

let mapping = [
  ["亳升", "ML"],
  ["毫升", "ML"],
  ["公升", "L"],
  ["千克", "KG"],
  ["升", "L"],
  ["克", "G"],
  ["CAN", ""],
  ["罐", ""],
  ["樽", ""],
  ["支", ""],
  ["枝", ""],
  ["重", ""],
  ["袋", ""],
  ["盒", "pcs"],
  ["包", "pcs"],
  ["件", "pcs"],
  ["裝", "pcs"],
];

//-------------------------------------------------------------------------------------------
// Migration: raw-data entry
//-------------------------------------------------------------------------------------------

export async function seed(knex: Knex): Promise<void> {
    //-------------------------------------------------------------------------------------------
      // functions for checking 
      //-------------------------------------------------------------------------------------------
    
      //function of checking the brand if it exists in the database
      async function checkBrand(brand: string) {
        const result = await knex.select("*").from("brands").where("brand_name", brand);
        if (result.length != 0) {
          return result;
        } else {
          const result = await knex("brands")
            .insert([
              {
                brand_name: brand,
              },
            ])
            .returning("*");
          return result;
        }
    
      }
    
      // function of checking the product_name if it exists in the database
      async function checkProduct(product_name: string) {
        const result = await knex.select("*").from("products").where("product_name", product_name);
        if (result.length != 0) {
          return result;
        } else {
          const result = await knex("products")
            .insert([
              {
                product_name: product_name,
              },
            ])
            .returning("id");
          return result;
        }
    
      }
    
      //-------------------------------------------------------------------------------------------
      // Migration: PK
      //-------------------------------------------------------------------------------------------
    
      //products from PK shop
      const pk = (await workbookToJSON("./data/beer_20220816.xlsx", "pk")) as Product[];
    
      for (const file of pk) {
        //check brand
        let result = await checkBrand(file.brand);
        const brand_id = result[0].id;
    
        //check market
        result = await knex.select("id").from("markets").where("market_name", "PK");
        const market_id = result[0].id;
    
        //check category
        result = await knex
          .select("id")
          .from("categories")
          .where("category_name", "beer");
        const category_id = result[0].id;
    
        //check product name
        const product_id = await checkProduct(joinProductNameAndBrand(file.product_name, file.brand, file.description));
    
        await knex
          .insert([
            {
              brand_id: brand_id,
              market_id: market_id,
              product_id: product_id[0].id,
              category_id: category_id,
              price: file.price,
            },
          ])
          .into("forjoining");
      }
    
      logger.info("beer: PK data inserted");
    
      //-------------------------------------------------------------------------------------------
      // Migration: Zstore
      //-------------------------------------------------------------------------------------------
    
      // products from zstore
      const zstore = (await workbookToJSON(
        "./data/beer_20220816.xlsx",
        "zstore"
      )) as Product[];
    
      for (const file of zstore) {
        //check brand
        let result = await checkBrand(file.brand);
        const brand_id = result[0].id;
    
        //check market
        result = await knex.select("id").from("markets").where("market_name", "Zstore");
        const market_id = result[0].id;
    
        //check category
        result = await knex
          .select("id")
          .from("categories")
          .where("category_name", "beer");
        const category_id = result[0].id;
    
        //check product name
        const product_id = await checkProduct(joinProductNameAndBrand(file.product_name, file.brand, file.description));
    
        await knex
          .insert([
            {
              brand_id: brand_id,
              market_id: market_id,
              product_id: product_id[0].id,
              category_id: category_id,
              price: file.price,
            },
          ])
          .into("forjoining");
      }
    
      logger.info("beer: zstore data inserted");
    
      //-------------------------------------------------------------------------------------------
      // Migration: Aeon
      //-------------------------------------------------------------------------------------------
    
      //products from aeon
      const aeon = (await workbookToJSON(
        "./data/beer_20220816.xlsx",
        "aeon"
      )) as Product[];
    
      for (const file of aeon) {
    
        //check brand
        let brand_id;
        let brand_name;
        if (file.brand == null || file.brand == undefined) {
          let result = await checkBrand("-");
          brand_id = result[0].id;
          brand_name = result[0].brand_name;
        } else {
          //check brand
          let result = await checkBrand(file.brand);
          brand_id = result[0].id;
          brand_name = result[0].brand_name;
        }
    
        //check market
        let result = await knex.select("id").from("markets").where("market_name", "Aeon");
        const market_id = result[0].id;
    
        //check category
        result = await knex
          .select("id")
          .from("categories")
          .where("category_name", "beer");
        const category_id = result[0].id;
    
        //check product name
        const product_id = await checkProduct(joinProductNameAndBrand(file.product_name, brand_name, file.description));
    
        await knex
          .insert([
            {
              brand_id: brand_id,
              market_id: market_id,
              product_id: product_id[0].id,
              category_id: category_id,
              price: file.price,
            },
          ])
          .into("forjoining");
      }
    
      logger.info("beer: aeon data inserted");
    
    };
    
    
    //-------------------------------------------------------------------------------------------
    // Functions
    //-------------------------------------------------------------------------------------------
    
    //workbook
    async function workbookToJSON(filename: string, sheetname: string) {
        const workbook = xlsx.readFile(filename);
        const worksheet = workbook.Sheets[sheetname];
        return xlsx.utils.sheet_to_json(worksheet);
      }
      
      //delete all Chinese Characters
      function noChineseCharacters(string: string) {
        for (let map of mapping) {
          if (string.includes(map[0])) {
            string = string.replace(map[0], map[1]);
          }
        }
        return string;
      }
      
      //description formatter
      function descriptionFormatter(string: string) {
        let description;
        // finding all matched charaters
        let re = new RegExp(
          "((((([A-Za-z0-9])|([A-Za-z0-9])\\w+)\\.)?([A-Za-z0-9])\\w+)|\\d)",
          "g"
        );
        let newString = noChineseCharacters(string.trim());
        let strArray = newString.match(re);
      
        // if the word matches the regex
        if (strArray) {
          if (strArray.length > 1) {
            // push the ML and the L to the front of the array
            if (
              strArray[strArray.length - 1].includes("ML") ||
              strArray[strArray.length - 1].includes("L")
            ) {
              strArray.unshift(strArray[strArray.length - 1]);
              strArray.pop();
              description = strArray.join("x");
            } else {
              description = strArray.join("x");
            }
          } else {
            let newString = strArray[0];
            let uppercased = newString.toUpperCase();
            if (uppercased.includes("X")) {
              let temperWords;
              temperWords = uppercased.split("X");
              if (
                // push the ML and the L to the front of the array
                (temperWords[temperWords.length - 1].includes("ML") ||
                  temperWords[temperWords.length - 1].includes("L")) &&
                temperWords.length > 0
              ) {
                temperWords.unshift(temperWords[temperWords.length - 1]);
                temperWords.pop();
                description = temperWords.join("x");
              } else {
                description = temperWords.join("x");
              }
            } else {
              description = uppercased;
            }
          }
      
          return description;
          //if no match is found, return the original string
        } else {
          return newString;
        }
      }
      
      //join the product_name and brand
      
      function joinProductNameAndBrand(product_name: string, brand: string, description: string) {
        if (description == null || description == undefined) {
          let joinedString = brand + " " + product_name;
          return joinedString;
        } else {
          let formattedDescription = descriptionFormatter(description);
          let joinedString = brand + " " + product_name + " " + formattedDescription;
          return joinedString;
        }
      }
