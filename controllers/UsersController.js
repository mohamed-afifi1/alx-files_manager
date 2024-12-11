import sha1 from 'sha1';
import dbClient from '../utils/db';

export default class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    const userOld = await (await dbClient.users()).findOne({ email });
    if (userOld) {
      return res.status(400).json({ error: 'Already exists' });
    }
    const hashedPassword = sha1(password);
    const insert = await (await dbClient.users()).insertOne({ email, password: hashedPassword });
    res.status(201).json({ email, id: insert.insertedId.toString() });
    return null;
  }
}
