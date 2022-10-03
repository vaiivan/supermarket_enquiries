// -------------------------------------------------------------------------------------------------------------------
// imports
// -------------------------------------------------------------------------------------------------------------------
import express from 'express'
import fs from 'fs'
import formidable from 'formidable'
import * as bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import Knex from 'knex'
import dotenv from "dotenv";


// -------------------------------------------------------------------------------------------------------------------
// check if the user is login or not
// -------------------------------------------------------------------------------------------------------------------
export const isLogin = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session['isLogin']) {
		next()
	} else {
		res.redirect("/")
	}
}

// -------------------------------------------------------------------------------------------------------------------
// knex config
// -------------------------------------------------------------------------------------------------------------------
	dotenv.config();

	const knexConfigs = require("../../knexfile");
	const configMode = process.env.NODE_ENV || "development";
	const knexConfig = knexConfigs[configMode];
	export const knex = Knex(knexConfig);

// -------------------------------------------------------------------------------------------------------------------
// formidable (upload dir will be opened if it doesn't exist)
// -------------------------------------------------------------------------------------------------------------------

const uploadDir = 'uploads'
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync('uploads', { recursive: true })
}

export const form = formidable({
	uploadDir: uploadDir,
	keepExtensions: true,
	multiples: true,
	maxFiles: 1,
	maxFileSize: 20 * 1024 * 1024 ** 2, // 20MB
	filter: (part) => part.mimetype?.startsWith('image/') || false
})

// -------------------------------------------------------------------------------------------------------------------
// hash password
// -------------------------------------------------------------------------------------------------------------------

const SALT_ROUNDS = 10

export async function hashPassword(plainPassword: string) {
	const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS)
	return hash
}

export async function checkPassword(
	plainPassword: string,
	hashPassword: string
) {
	const match = await bcrypt.compare(plainPassword, hashPassword)
	return match
}

// -------------------------------------------------------------------------------------------------------------------
// nodemailer sending receipt
// -------------------------------------------------------------------------------------------------------------------

export const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, // upgrade later with STARTTLS
	auth: {
		user: 'sherryli717@gmail.com',
		pass: 'ufqmtfcpjucnayxk'
	}
})