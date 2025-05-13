import express from 'express';
import studioController from '../controllers/studioController.js';

const router = express.Router();

router
  .route('/')
  .get(studioController.getAllStudios)
  .post(studioController.createStudio);

router
  .route('/:id')
  .get(studioController.getStudio)
  .patch(studioController.updateStudio)
  .delete(studioController.deleteStudio);

export default router;
