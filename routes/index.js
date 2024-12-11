import express from 'express';
import AppController from '../controllers/AppController';
import usersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

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
  router.get('/connect', (req, res) => {
    AuthController.getConnect(req, res);
  });
  router.get('disconnect', (req, res) => {
    AuthController.getDisconnect(req, res);
  });
  router.get('/users/me', (req, res) => {
    usersController.getMe(req, res);
  });
}

export default controllerRouting;
