import { Router } from 'express';
import { CsvTempController } from './CsvTemp.controller';
import auth from '../../middlewares/auth';
import { upload } from '../../middlewares/upload';

const router = Router();

// CSV file upload route
router.post('/upload', auth(), upload.single('file'), CsvTempController.upload);

router.get('/:batchId', auth(), CsvTempController.getByBatchId);
router.put('/:id', auth(), CsvTempController.update);
router.delete('/:id', auth(), CsvTempController.delete);
router.post('/finalize', auth(), CsvTempController.finalize);

export const CsvRoutes = router;
