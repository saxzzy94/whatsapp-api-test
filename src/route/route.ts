import { Router } from "express";
import { body, param } from "express-validator";
import MessageController from "../controller/messageController";
import WebhookService from "../controller/webhook";
import { errorCheck } from "../utils/check";

const router = Router();
router.post(
	"/setup",
	[body("apiKey").not().isEmpty()],
	errorCheck,
	WebhookService.setWebhook
);

router.post(
	"/messages",
	[
		body("to")
			.not()
			.isEmpty()
			.withMessage(
				"input your whatsapp number beginning with country code, without +"
			),
		body("body").not().isEmpty(),
	],
	errorCheck,
	MessageController.sendMessge
);

router.post(
	"/templates",
	[
		body("to")
			.not()
			.isEmpty()
			.withMessage(
				"input your whatsapp number beginning with country code, without +"
			),
		body("template_name").not().isEmpty(),
	],
	errorCheck,
	MessageController.sendTemplate
);

router.get(
	"/interactions/:id",
	[
		param("id")
			.not()
			.isEmpty()
			.isLength({ min: 13, max: 13 })
			.withMessage(
				"input your whatsapp number beginning with country code, without +"
			),
	],
	errorCheck,
	MessageController.getInteraction
);

export default router