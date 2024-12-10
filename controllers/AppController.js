import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getstatus(req, res) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    res.status(200).send(status);
  }

  static async getStats(req, res) {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();

    const stats = {
      users,
      files,
    };
    res.status(200).send(stats);
  }
}

export default AppController;
