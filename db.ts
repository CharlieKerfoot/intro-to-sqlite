//-----------------------------
//#region Database Connection
//-----------------------------
import path from 'path';
import { json, Request, Response } from 'express';
import sqlite3 from 'sqlite3';
const sqlite = sqlite3.verbose();
const filename = 'foo';
const dbFile = path.join(__dirname, filename + '.db');
// below is the line for vanilla ES6 js to work; not necessary with typescript
// const dbFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "foo.db");
const db = new sqlite.Database(dbFile, (error) => {
	if (error) return console.error(error.message);
	console.log(`Connected to database ${dbFile}`);
});

const handleError = (error: Error | null, response: Response) => {
	if (error) {
		console.error(error.message);
		response.status(400).json({ error: error.message });
		return;
	}
};

//#endregion Database Connection

//-----------------------------
//#region Routes
//-----------------------------
/**
 * Gets a single user by id
 */
export const getUserById = (request: Request, response: Response): void => {
	// Parse the id to generate a SQLite query
	const id: number = parseInt(request.params.id);
	const query: string = `SELECT * FROM user WHERE id = ?`;

	// db.get will replace all ? in query sequentially with
	// items from the array passed as the second parameter
	// and then run the callback function passed as the third param
	// What does the callback function do?
	db.get(query, [id], (error: Error, result: object): void => {
		handleError(error, response);
		// If nothing is returned, then result will be undefined
		if (result) {
			response.json(result);
		} else {
			response.sendStatus(404);
		}
	});
};

export const getAllUsers = (request: Request, response: Response): void => {
	const query: string = `SELECT * FROM user`;

	db.all(query, (error: Error, result: object): void => {
		handleError(error, response);

		if (result) {
			response.json(result);
		} else {
			response.sendStatus(404);
		}
	});
};

export const createUser = (request: Request, response: Response): void => {
	const query: string = 'INSERT INTO user(id, name)  Values(?, ?)';
	if (!request.body.name || !request.params.id)
		response.status(400).json({ error: 'Incorrect Parameters' });
	const id: number = parseInt(request.params.id);
	const name: string = request.body.name;

	db.run(query, [id, name], (error: Error): void => {
		handleError(error, response);

		response.status(201).json({ message: 'User Successfully Created' });
	});
};

const checkUser = (id: number): object | null => {
	const query: string = `SELECT * FROM user WHERE id = ?`;
	return new Promise((resolve, reject) => {
		db.get(query, [id], (error, result): void => {
			if (error) {
				reject(error);
			} else {
				resolve(result || null);
			}
		});
	});
};

export const updateUser = async (request: Request, response: Response): Promise<void> => {
	const query: string = 'UPDATE user SET name = ? WHERE id = ?';
	if (!request.body.name || !request.params.id)
		response.status(400).json({ error: 'Incorrect Parameters' });
	const id: number = parseInt(request.params.id);
	const name: string = request.body.name;

	try {
		const user = await checkUser(id);
		if (!user) {
			response.status(404).json({ error: 'User Does Not Exist' });
			return;
		}

		db.run(query, [name, id], (error): void => {
			handleError(error, response);

			response.status(200).json({ message: 'User Successfully Updated' });
		});
	} catch (error) {
		console.error(error);
		response.status(500).json({ error: 'Internal Server Error' });
	}
};

export const deleteUser = async (request: Request, response: Response): Promise<void> => {
	const query: string = 'DELETE FROM user WHERE id = ?';
	if (!request.params.id)
		response.status(400).json({ error: 'Incorrect Parameters' });
	const id: number = parseInt(request.params.id);

	try {
		const user = await checkUser(id);
		if (!user) {
			response.status(404).json({ error: 'User Does Not Exist' });
			return;
		}

		db.run(query, [id], (error: Error): void => {
			handleError(error, response);

			response.status(200).json({ message: 'User Successfully Deleted' });
		});
	} catch (error) {
		console.error(error);
		response.status(500).json({ error: 'Internal Server Error' });
	}
};
