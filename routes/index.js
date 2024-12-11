import express from 'express';
import AppController from '../controllers/AppController';
import usersController from '../controllers/UsersController';

function controllerRouting(app) {
  const router = express.Router();
  app.use('/', router);

  router.get('/status', (req, res) => {
    AppController.getstatus(req, res);
  });
  router.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });
  router.post('/users', (req, res) => {
    usersController.postNew(req, res);
  });
}

export default controllerRouting;
