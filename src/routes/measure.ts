import express from 'express';

import { confirmMeasureValue } from '../controllers/measure';

export default(router: express.Router) => {
    router.patch('/confirm', confirmMeasureValue);
}