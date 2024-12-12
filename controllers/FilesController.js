import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { promisify } from 'util';
import dbClient from '../utils/db';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

class FilesController {
  static async postUpload(req, res) {
    const token = req.headers['X-Token'];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const userId = req.user.id;
    const {
      name, type, parentId = 0, isPublic = false, data,
    } = req.body;

    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    const parentFile = parentId !== 0
      ? await dbClient.collection('files').findOne({ _id: parentId })
      : null;

    if (parentId !== 0 && !parentFile) {
      return res.status(400).json({ error: 'Parent not found' });
    }
    if (parentFile && parentFile.type !== 'folder') {
      return res.status(400).json({ error: 'Parent is not a folder' });
    }

    const fileData = {
      userId,
      name,
      type,
      isPublic,
      parentId,
    };

    if (type === 'folder') {
      const result = await dbClient.collection('files').insertOne(fileData);
      fileData._id = result.insertedId;
      return res.status(201).json(fileData);
    }

    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    try {
      await mkdir(folderPath, { recursive: true });
    } catch (err) {
      console.error(err);
    }

    const localPath = `${folderPath}/${uuidv4()}`;
    try {
      await writeFile(localPath, Buffer.from(data, 'base64'));
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Could not save file' });
    }

    fileData.localPath = localPath;
    const result = await dbClient.collection('files').insertOne(fileData);
    fileData._id = result.insertedId;

    res.status(201).json(fileData);
  }
}

export default FilesController;
