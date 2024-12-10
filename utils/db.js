import MongoClient from 'mongodb/lib/mongo_client';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
  constructor() {
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        this.db = false;
      } else {
        this.db = client.db(DB_DATABASE);
        this.users = this.db.collection('users');
        this.files = this.db.collection('files');
      }
    });
  }

  isAlive() {
    return Boolean(this.db);
  }

  nbUsers() {
    return this.users.countDocuments();
  }

  nbFiles() {
    return this.files.countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
