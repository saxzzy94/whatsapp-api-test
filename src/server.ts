import path from "path";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import sequelize from "./db";
import MessageController from "./controller/messageController";
import WebhookService from "./controller/webhook";
import routeHandler from "./route/route";
import { errorHandler } from "./utils/errorHandler";

const app = express();

app.use(bodyParser.json());

app.post("/webhook", WebhookService.manageWebhook);

app.use(express.json());

dotenv.config();

const port = process.env.PORT || 8080;

const start = async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully");

		app.get("/", MessageController.createConnection);
		app.use("/api", routeHandler);

		app.use(errorHandler);

		app.listen(port, () => {
			console.log("listening on port 8080");
		});
	} catch (e) {
		console.error("Unable to connect to the database:", e);
	}
};
start();
