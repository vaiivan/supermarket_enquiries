// -------------------------------------------------------------------------------------------------------------------
// imports & exports
// -------------------------------------------------------------------------------------------------------------------

import express from "express";
import { UserService } from "./service/userService";
import { UserController } from "./controller/userController";
import { InquiryService } from "./service/inquiryService";
import { InquiryController } from "./controller/inquiryController";
import { isLogin } from "./utilities/middlewareAndFunctions";
import { knex } from "./utilities/middlewareAndFunctions";

export const router = express.Router();

// -------------------------------------------------------------------------------------------------------------------
// user routes
// -------------------------------------------------------------------------------------------------------------------

const userService = new UserService(knex);
const userController = new UserController(userService);

router.post("/register", userController.createUser);
router.get("/user", userController.getUserInfo);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

// -------------------------------------------------------------------------------------------------------------------
// uploads
// -------------------------------------------------------------------------------------------------------------------

//temperately just for testing purposes
router.post("/uploads", isLogin, userController.upload);

// -------------------------------------------------------------------------------------------------------------------
// inquiry routes
// -------------------------------------------------------------------------------------------------------------------

const inquiryService = new InquiryService(knex);
const inquiryController = new InquiryController(inquiryService);

router.get("/categories", inquiryController.getCategories);
router.get("/inquery", inquiryController.searchProducts);
router.get("/searchDrinks", inquiryController.searchDrinks);
router.get("/searchBeers", inquiryController.searchBeers);
router.get("/searchSnacks", inquiryController.searchSnacks);
