/* eslint-disable */
import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';

class AuthController {

  static async getConnect(req, res) {

    const authHeader = req.headers.authorization;

    // example of authHeader : Authorization: Basic <Base64EncodedCredentials>
    // example of authHeader : Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const base64 = authHeader.split(' ')[1]; // Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=
    const credentials = Buffer.from(base64, 'base64').toString('utf-8'); // bob@dylan.com:toto1234!  
    const [email, password] = credentials.split(':'); // ['bob@dylan.com', 'toto1234!']

    if (!email || !password) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    // Hash the password
    const hashedPassword = sha1(password);

    const user = await dbClient.users.findOne({ email, password: hashedPassword });

    // If the user is not found, return an unauthorized error
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    const tokenKey = `auth_${token}`;

    await redisClient.set(tokenKey, user._id, 24 * 3600); // 3600 to convert to seconds

    return res.status(200).send({ token });
  }

    
  static async getDisconnect(req, res) {

    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const tokenKey = `auth_${token}`;

    const userId = await redisClient.get(tokenKey);

    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    await redisClient.del(tokenKey);

    return res.status(204).send();
  }
}

export default AuthController;
