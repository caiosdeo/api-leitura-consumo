import express from 'express';

import { newMeasure, getCustomerMeasures } from '../controllers/customer';

export default(router: express.Router) => {
    router.post('/upload', newMeasure);
    router.get('/:customer_code/list', getCustomerMeasures); 
}