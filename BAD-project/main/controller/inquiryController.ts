// -------------------------------------------------------------------------------------------------------------------
// imports & exports
// ----------------------- --------------------------------------------------------------------------------------------
import express from "express";
import { InquiryService } from "../service/inquiryService";
// import { form } from "../utilities/middlewareAndFunctions";
import { logger } from "../utilities/logger";

// -------------------------------------------------------------------------------------------------------------------
// Controller
// -------------------------------------------------------------------------------------------------------------------

export class InquiryController {
  constructor(private inquiryService: InquiryService) {}

  // -------------------------------------------------------------------------------------------------------------------
  // return all brands to frontend
  // -------------------------------------------------------------------------------------------------------------------

  getCategories = async (req: express.Request, res: express.Response) => {
    try {
      const result = await this.inquiryService.getCategories();
      res.json(result);
    } catch (err) {
      logger.error(err);
      res.json([{ status: 500, message: "Internal Server Error" }]);
    }
  };

  // -------------------------------------------------------------------------------------------------------------------
  // search function
  // -------------------------------------------------------------------------------------------------------------------
  searchProducts = async (req: express.Request, res: express.Response) => {
    try {
      let enquiries = req.query.search;

      let result = await this.inquiryService.searchProducts(
        enquiries as string
      );
      res.send(result.search.rows);
    } catch (err) {
      logger.error(err);
      res.json([{ status: 500, message: "Internal Server Error" }]);
    }
  };

  searchDrinks = async (req: express.Request, res: express.Response) => {
    try {
      let result = await this.inquiryService.searchDrinks();
      res.send(result.soft_drinks.rows);
    } catch (err) {
      logger.error(err);
      res.json([{ status: 500, message: "Internal Server Error" }]);
    }
  };

  searchBeers = async (req: express.Request, res: express.Response) => {
    try {
      let result = await this.inquiryService.searchBeers();
      res.send(result.beers.rows);
    } catch (err) {
      logger.error(err);
      res.json([{ status: 500, message: "Internal Server Error" }]);
    }
  };

  searchSnacks = async (req: express.Request, res: express.Response) => {
    try {
      let result = await this.inquiryService.searchSnacks();
      res.send(result.snacks.rows);
    } catch (err) {
      logger.error(err);
      res.json([{ status: 500, message: "Internal Server Error" }]);
    }
  };
}
