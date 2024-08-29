import express from 'express';

import customer from './customer';
import measure from './measure';

const router = express.Router();

export default (): express.Router => {
    
    customer(router);
    measure(router);
    
    return router;
}