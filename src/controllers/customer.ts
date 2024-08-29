import express from 'express';

import { validateDate, validateMeasureType, validateImage, validateString } from '../helpers';
import { fetchCustomerMeasures, handleCustomerAndMeasure, processImageAndGenerateMeasure } from '../services/customer_service';

export const newMeasure = async (req: express.Request, res: express.Response) => {
    try {
        
        const { image, customer_code, measure_datetime, measure_type } = req.body;
        
        try {
            validateString(customer_code);
            validateImage(image);
            validateDate(measure_datetime);
            validateMeasureType(measure_type);
        } catch (error: any) {
            return res.status(error.code).json(error.json);
        }

        const { customer, error } = await handleCustomerAndMeasure(customer_code, measure_type, measure_datetime);

        if (error) {
            return res.status(error.code).json(error.json);
        }

        const { image_url, measure_value, measure_uuid } = await processImageAndGenerateMeasure(image, customer, measure_datetime, measure_type);

        const responseBody = {
            image_url,
            measure_value,
            measure_uuid,
        };

        return res.status(200).json(responseBody);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// GET  /<customer code>/list
export const getCustomerMeasures = async (req: express.Request, res: express.Response) => {

    try {
        const { customer_code } = req.params;

        const measure_type = req.query.measure_type as string || null;
    
        if (measure_type) {
            try {
                validateMeasureType(measure_type, "INVALID_TYPE", "Tipo de medição não permitida");
            } catch (error: any) {
                return res.status(error.code).json(error.json);
            }
        }
    
        const measures = await fetchCustomerMeasures(customer_code, measure_type);

        if (!measures) {
            return res.status(404).json({
                "error_code": "MEASURE_NOT_FOUND",
                "error_description": "Nenhuma leitura encontrada"
            });
        }

        return res.status(200).json(measures);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}