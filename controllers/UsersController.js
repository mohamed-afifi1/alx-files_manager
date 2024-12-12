/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { ObjectId } from 'mongodb';

export default class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }
    const user = await (await dbClient.usersCollection()).findOne({ email });
    if (user) {
      res.status(400).json({ error: 'Already exist' });
      return;
    }
    const insertionInfo = await (await dbClient.usersCollection())
      .insertOne({ email, password: sha1(password) });
    const userId = insertionInfo.insertedId.toString();

    res.status(201).json({ email, id: userId });
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const tokenKey = `auth_${token}`;

    const userId = await redisClient.get(tokenKey);

    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const user = await (await dbClient.usersCollection()).findOne({ _id: ObjectId(userId) });

    res.status(200).json({id: user._id, email: user.email });

  }
}
