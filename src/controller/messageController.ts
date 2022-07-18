import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { Message, User } from "../model/model";
import { Op } from "sequelize";
import { AppError } from "../utils/errorHandler";

class MessageController {
	static url = `${process.env.SANDBOX_URL}/v1/messages`;
	static async createConnection(req: Request, res: Response) {
		try {
			const result = await axios.get("https://wa.me/4930609859535?text=START");
			res.send(result.data);
		} catch (error) {
			console.log(error);
		}
	}
	private static async findName(to: any): Promise<string> {
		let username = "";
		const user = await User.findOne({ where: { user_id: to } });
		if (user) {
			username = user.name;
		}

		return username;
	}
	private static async send(
		data: any,
		apiKey: string,
		content: any,
		res: Response<any, Record<string, any>>
	) {
		try {
			const result = await axios.post(MessageController.url, data, {
				headers: {
					"Content-Type": "application/json",
					"D360-API-KEY": apiKey,
				},
			});
			const contact = result.data.contacts[0];
			const message = result.data.messages[0];
			Message.create({
				creator_id: process.env.SANDBOX_NUMBER,
				recipient_id: contact.wa_id,
				message_id: message.id,
				message_body: content,
			});
			User.findOne({ where: { user_id: process.env.SANDBOX_NUMBER } })
				.then((user) => {
					if (user) {
						return res.json({ message: "message sent" });
					}
					User.create({
						name: "sandbox",
						user_id: process.env.SANDBOX_NUMBER,
					});
					res.json({
						status: "success",
						message: "message sent",
					});
				})
				.catch((err) => {
					return new AppError(err, 500, false);
				});
		} catch (err: any) {
			throw err;
		}
	}

	static async sendMessge(req: Request, res: Response, next: NextFunction) {
		try {
			const { to, content } = req.body;
			const apiKey = req.headers.authorization as string;
			const data = {
				recipient_type: "individual",
				to,
				type: "text",
				text: { body: content },
			};

			await MessageController.send(data, apiKey, content, res);
		} catch (err: any) {
			console.log(err);
			const message =
				err.response.data.meta.developer_message ||
				err.response.data.errors[0].title;
			const statusCode = err.response.data.meta.http_code;
			return next(new AppError(message, statusCode, true));
		}
	}

	static async sendTemplate(req: Request, res: Response, next: NextFunction) {
		try {
			const { to, template_name } = req.body;

			let apiKey = "";

			if (!req.headers.authorization) {
				return new AppError("you are not authorized", 403, true);
			}

			apiKey = req.headers.authorization;

			const username = MessageController.findName(to);
			const data = {
				to: to,
				type: "template",
				template: {
					namespace: process.env.NAMESPACE,
					language: { policy: "deterministic", code: "en" },
					name: template_name,
					components: [
						{ type: "body", parameters: [{ type: "text", text: username }] },
					],
				},
			};

			await MessageController.send(data, apiKey, template_name, res);
		} catch (err: any) {
			const message =
				err.response.data.meta.developer_message ||
				err.response.data.errors[0].title;
			const statusCode = err.response.data.meta.http_code;
			return next(new AppError(message, statusCode, true));
		}
	}
	static async getInteraction(req: Request, res: Response) {
		try {
			const id = req.params.id;
			console.log(process.env.SANDBOX_NUMBER);
			Message.findAll({
				where: {
					[Op.or]: [{ recipient_id: id }, { creator_id: id }],
				},
				order: ["timestamp", "timestamp"],
			})
				.then((response) => {
					res.json(response);
				})
				.catch((err) => {
					throw err;
				});
		} catch (error) {
			console.log(error);
		}
	}
}

export default MessageController;
