import { Sequelize } from "sequelize-typescript";
import { Message, User } from "./model/model";

const sequelize = new Sequelize(process.env.CONNECTION_URL!);

sequelize.addModels([User]);
sequelize.addModels([Message]);
Message.sync()
	.then(() => {
        console.log("message table created successfully")
		User.sync()
			.then(() => {
                console.log("user table created")
            })
			.catch((err) => {
				return err;
			});
	})
	.catch((err) => {
		return err;
	});

export default sequelize;
