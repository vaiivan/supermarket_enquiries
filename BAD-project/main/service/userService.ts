// -------------------------------------------------------------------------------------------------------------------
// imports
// -------------------------------------------------------------------------------------------------------------------

import { Knex } from "knex";
import { logger } from "../utilities/logger";
import {
  hashPassword,
  checkPassword,
} from "../utilities/middlewareAndFunctions";

// -------------------------------------------------------------------------------------------------------------------
// user services
// -------------------------------------------------------------------------------------------------------------------

export class UserService {
  constructor(private knex: Knex) { }

  // -------------------------------------------------------------------------------------------------------------------
  // create new User
  // -------------------------------------------------------------------------------------------------------------------

  async createNewUser(body: any) {
    //insert new User
    const { username, password, email } = body;
    const hashedPassword = await hashPassword(password);
    return await this.knex
      .insert([
        {
          username: username,
          email: email,
          password: hashedPassword,
        },
      ])
      .into("users")
      .returning("id");
  }

  // -------------------------------------------------------------------------------------------------------------------
  // check password
  // -------------------------------------------------------------------------------------------------------------------

  async checkpassword(password: any, email: any) {
    const result = await this.knex
      .select("*")
      .from("users")
      .where("email", email);
    const checking = await checkPassword(password, result[0].password);

    if (checking) {
      return result;
    } else {
      return false;
    }
  }

  // -------------------------------------------------------------------------------------------------------------------
  // get User data
  // -------------------------------------------------------------------------------------------------------------------

  async getUserInfo(userId: number) {
    return await this.knex.select("*").from("users").where("id", userId);
  }

  // -------------------------------------------------------------------------------------------------------------------
  // upload files
  // -------------------------------------------------------------------------------------------------------------------

  async uploads(id: number, file: any, status: string) {
    if (status == "upload") {
      const result = await this.knex
        .insert([
          {
            user_id: id,
            file_name: file,
          },
        ])
        .into("user_uploads")
        .returning("id");
      logger.info("file uploaded");
      return result;
    } else if (status == "regonized") {
      const result = await this.knex("user_uploads").where({id: id})
        .update(
          {
            regonize: file,
          },
        )
      logger.info("file regonized");
      return result;
    } else {
      return false;
    }
  }

  // -------------------------------------------------------------------------------------------------------------------
  // description formatter
  // -------------------------------------------------------------------------------------------------------------------

  descriptionFormatter(description: string) {
    let re = new RegExp('(([A-Z])\\w+)|([\u4e00-\u9fa5])|\\d+','g');
    let result = description.match(re)?.join('');
    console.log(result)
    return result;
  }
  
  // -------------------------------------------------------------------------------------------------------------------
  //  update User data
  // -------------------------------------------------------------------------------------------------------------------

  async updateUserInfo(body: any, userId: number) {
    const { name, password, email } = body;
    const hashedPassword = await hashPassword(password);
    return await this.knex
      .update(name, hashedPassword, email)
      .from("users")
      .where("id", userId);
  }
}
