import { Sequelize } from "sequelize-typescript";
import { Message, User } from "./model/model";

const sequelize = new Sequelize({
	database: process.env.DATABASE,
	dialect: "postgres",
	username: process.env.USERNAME,
	password: process.env.PASSWORD,
	port: 5432,
	host: process.env.HOST,
	dialectOptions: {
		ssl: {
			require: true, // This will help you. But you will see nwe error
			rejectUnauthorized: false, // This line will fix new error
		},
	},
	models: [__dirname + "/models"], // or [Player, Team],
});

sequelize.addModels([User]);
sequelize.addModels([Message]);
Message.sync()
	.then(() => {
		console.log("message table created successfully");
		User.sync()
			.then(() => {
				console.log("user table created");
			})
			.catch((err) => {
				return err;
			});
	})
	.catch((err) => {
		return err;
	});

export default sequelize;
