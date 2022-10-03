// -------------------------------------------------------------------------------------------------------------------
// imports (DO NOT EXPORT ANYTHING FORM App.ts)
// -------------------------------------------------------------------------------------------------------------------
import express from "express";
import expressSession from "express-session";
import { logger } from "./main/utilities/logger";
import { router } from "./main/routes";
import { isLogin } from "./main/utilities/middlewareAndFunctions";

// -------------------------------------------------------------------------------------------------------------------
// session
// -------------------------------------------------------------------------------------------------------------------
const app = express();

//session
app.use(
  expressSession({
    secret: "Extremely secret secret",
    resave: true,
    saveUninitialized: true,
  })
);

// -------------------------------------------------------------------------------------------------------------------
// others
// -------------------------------------------------------------------------------------------------------------------

//urlencoded
app.use(express.urlencoded({ extended: true }));

//json
app.use(express.json());

//router
app.use(router);

//get files from public, src, default images & uploads
app.use(express.static("public"));
app.use("/serverDefaultedImages", express.static("images"));
app.use("/userUploadedFiles", express.static("uploads"));

//get files from private (need to login)
app.use(isLogin, express.static("private"));

// --------------------------------------------------------------------------------------------------------------------
// listening
//---------------------------------------------------------------------------------------------------------------------
app.listen(8310, () => {
  logger.info("listening on port 8310");
});
