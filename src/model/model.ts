import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

@Table
export class User extends Model {
	@Default(DataType.UUIDV4)
	@Column({
		primaryKey: true,
		unique: true,
		type: DataType.UUID,
	})
	id!: string;

	@Column
	name!: string;

	@Column
	user_id!: string;
}
@Table
export class Message extends Model {
	@Default(DataType.UUIDV4)
	@Column({
		primaryKey: true,
		unique: true,
		type: DataType.UUID,
	})
	id!: string;

	@Column
	creator_id!: string;

	@Column
	recipient_id!: string;

	@Column
	message_id!: string;

	@Column
	message_body!: string;
	@Column
	timestamp?: string;

	@Column
	status?: string
}
