import axios from "axios";
import { Request, Response } from "express";
import { Message, User } from "../model/model";

export default class WebhookService {
	static url = `${process.env.SANDBOX_URL}/v1/configs/webhook`;

	static async setWebhook(req: Request, res: Response) {
		try {
			const result = await axios.post(
				WebhookService.url,
				{ url: `https://${req.get("host")}/webhook` },
				{
					headers: {
						"Content-Type": "application/json",
						"D360-API-KEY": req.body.apiKey,
					},
				}
			);

			res.json({ status: result.status, message: "webhook set" });
		} catch (error: any) {
			console.error(error);
		}
	}
	static async manageWebhook(req: Request, res: Response) {
		try {
			const { messages, contacts, statuses } = req.body;
			if (messages && contacts && messages.length > 0 && contacts.length > 0) {
				saveIncomingMessages(messages, contacts);

				return res.json({ status: "success", message: "message received" });
			}
			if (statuses && statuses.length > 0) {
				updateMessageStatuses(statuses, res);
			}

			if (req.body.errors) {
				console.log(req.body.errors);
				res.send(req.body.errors);
			}
		} catch (error) {
			console.log(error);
		}
	}
}
function saveIncomingMessages(messages: any, contacts: any) {
	const message = messages[0];
	const contact = contacts[0];
	//Save messages
	Message.create({
		creator_id: message.from,
		message_id: message.id,
		message_body: message.text.body,
		timestamp: message.timestamp,
		recipient_id: process.env.SANDBOX_NUMBER,
	});
	User.findOne({ where: { user_id: contact.wa_id } })
		.then((user) => {
			if (user) {
				return;
			}
			User.create({
				name: contact.profile.name,
				user_id: contact.wa_id,
			});
		})
		.catch((err) => {
			console.error(err);
		});
}

function updateMessageStatuses(
	statuses: any,
	res: Response<any, Record<string, any>>
) {
	const status = statuses[0];
	Message.update(
		{ status: status.status, timestamp: status.timestamp },
		{ where: { message_id: status.id } }
	)

		.then((count) => {
			if (count) {
				res.json({ status: "success", message: "message updated" });
			}
		})
		.catch((err) => {
			res.status(500).json({ error: err });
		});
}
