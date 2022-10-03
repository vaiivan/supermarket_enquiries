// -------------------------------------------------------------------------------------------------------------------
// imports & exports
// --------------------------------------------------------------------------------------------------------------------
import express from "express";
import { UserService } from "../service/userService";
import { form } from "../utilities/middlewareAndFunctions";
import { logger } from "../utilities/logger";
import { RequestInfo, RequestInit } from "node-fetch";
import dotenv from "dotenv";
import FormData from "form-data";
import fs from "fs";

const fetch = (url: RequestInfo, init?: RequestInit) =>
  import("node-fetch").then(({ default: fetch }) => fetch(url, init));

dotenv.config();

// -------------------------------------------------------------------------------------------------------------------
// Controller
// -------------------------------------------------------------------------------------------------------------------

export class UserController {
  constructor(private userService: UserService) {}

  // -------------------------------------------------------------------------------------------------------------------
  // Login
  // -------------------------------------------------------------------------------------------------------------------

  login = async (req: express.Request, res: express.Response) => {
    try {
      const { password, email } = req.body;
      const result = await this.userService.checkpassword(password, email);
      if (result) {
        req.session["userId"] = result[0].id;
        req.session["isLogin"] = true;
        res.json([{ ok: true, message: "successfully logged in" }]);
      } else {
        res.json([{ ok: false, message: "invaild email or password" }]);
      }
    } catch (err) {
      logger.error(err);
      res.json([{ status: 500, message: "Internal Server Error" }]);//res.status(500).json()
    }
  };

  // -------------------------------------------------------------------------------------------------------------------
  // create new user
  // -------------------------------------------------------------------------------------------------------------------

  createUser = async (req: express.Request, res: express.Response) => {
    try {
      //call function
      const userId = await this.userService.createNewUser(req.body);
      req.session["userId"] = userId[0].id;
      req.session["isLogin"] = true;
      //json message
      res.json([{ ok: true, message: "User created" }]);
    } catch (err) {
      logger.error(err);
      res.json([{ status: 500, message: "Internal Server Error" }]);
    }
  };

  // -------------------------------------------------------------------------------------------------------------------
  // get User data
  // -------------------------------------------------------------------------------------------------------------------

  getUserInfo = async (req: express.Request, res: express.Response) => {
    try {
      if (
        req.session["isLogin"] == false ||
        req.session["isLogin"] == undefined
      ) {
        res.json([{ message: "invalid User" }]);
      } else {
        const userId = req.session["userId"];
        //get the data
        const result = await this.userService.getUserInfo(userId);
        res.json(result);
      }
    } catch (err) {
      logger.error(err);
      res.json([{ status: 500, message: "Interal Server Error" }]);
    }
  };

  // -------------------------------------------------------------------------------------------------------------------
  // logout
  // -------------------------------------------------------------------------------------------------------------------

  logout = async (req: express.Request, res: express.Response) => {
    try {
      req.session["isLogin"] = false;
      //res.json([{message: "successfully logged out"}]);
      res.json([{ ok: true, message: "successfully logged out" }]);
    } catch (err) {
      logger.error(err);
      res.json([{ status: 500, message: "Internal Server Error" }]);
    }
  };

  // -------------------------------------------------------------------------------------------------------------------
  // uploaded files to python
  // -------------------------------------------------------------------------------------------------------------------

  upload = async (req: express.Request, res: express.Response) => {
    try {
      form.parse(req, async (err, fields, files) => {
        // check if file exists
        const file_name =
          files.file != null && !Array.isArray(files.file)
            ? files.file.newFilename
            : null;
        //if no file
        if (!file_name) {
          throw new Error("file not found");
        }
        //get the application number and convert the file into form data
        const application = await this.userService.uploads(
          req.session["userId"],
          file_name,
          "upload"
        );

        const formData = new FormData();
        formData.append("file", fs.createReadStream("./uploads/" + file_name));
        formData.append("applicationId", application[0].id);

        // await fetching to python cv2
        const response = await fetch(`${process.env.CV2_LINK}`, {
          method: "POST",
          body: formData,
        });

        logger.info("request sent to python cv2");
        logger.info(process.env.CV2_LINK)


        //await result returned and format the data
        let price;
        let description;
        let recongized;
        let result;
        if(response){
          result = await response.json();
        }

        console.log(result)


        if (result.final_result) {
          if (
            result.final_result.description == "" ||
            result.final_result.price == ""
          ) {
            res.json({ status: 500, message: "no description found" });
          } else {
            price = result.final_result.price;
            //// const description = this.userService.descriptionFormatter(result.final_result.description);
            description = result.final_result.description;
            recongized = {
              status: "success",
              price: price,
              description: description,
            };

            //add the file into sql
            await this.userService.uploads(
              application[0].id,
              recongized,
              "regonized"
            );

            //json
            res.json(recongized);
          }
        } else {
          res.json({ message: "fucking debugging" });
        }
      });
    } catch (err) {
      logger.error(err);
      res.json([{ status: 500, message: "Internal Server Error" }]);
    }
  };

  // -------------------------------------------------------------------------------------------------------------------
  // update User data
  // -------------------------------------------------------------------------------------------------------------------

  patch = async (req: express.Request, res: express.Response) => {
    form.parse(req, async (err, fields, files) => {
      try {
        const userId = req.session["userId"];

        await this.userService.updateUserInfo(fields, userId);
      } catch (err) {
        logger.error(err);
        res.json([{ status: 500, message: "Internal Server Error" }]);
      }
    });
  };
}
