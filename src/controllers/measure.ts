import express from 'express';

import { validateInteger, validateString } from "../helpers";
import { confirmMeasure } from '../services/measure_service';

// PATCH /confirm
export const confirmMeasureValue = async (req: express.Request, res: express.Response) => {
    try {
        
        const { measure_uuid, confirmed_value } = req.body;
        
        try {
            validateString(measure_uuid);
            validateInteger(confirmed_value);
        } catch (error: any) {
            return res.status(error.code).json(error.json);
        }

        const { error, success } = await confirmMeasure(measure_uuid, confirmed_value);

        if (error) {
            return res.status(error.code).json(error.json);
        }

        return res.status(200).json({ success });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}