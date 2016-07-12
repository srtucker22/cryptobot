import { Router } from 'express';
import * as FileController from '../controllers/file.controller';

const router = new Router();

// Get a random quote
router.route('/random').get(RouteController.getRandomQuote);

export default router;
