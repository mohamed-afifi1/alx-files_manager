import express from 'express';
import controllerRouting from './routes/index';

const app = express();

app.use(express.json());

controllerRouting(app);

const PORT = process.env.PORT || 5000;

// listen to a PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
