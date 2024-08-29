import { v4 as uuidv4 } from 'uuid';
import { Types } from 'mongoose';

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

import { saveBase64Image } from '../helpers/index';
import { createMeasure, existsMeasureInMonth, MeasureModel } from '../db/measure';
import { addMeasure, createCustomer, getCustomerByCode } from '../db/customer';

export const handleCustomerAndMeasure = async (customer_code: string, measure_type: string, measure_datetime: string) => {
    let customer = await getCustomerByCode(customer_code);;

    if (!customer) {
        customer = await createCustomer({ customer_code });
    }

    const customerId: Types.ObjectId = customer._id as Types.ObjectId;

    if (await existsMeasureInMonth(customerId, measure_type, measure_datetime)) {
        return {
            error: {
                code: 409,
                json: {
                    "error_code": "DOUBLE_REPORT",
                    "error_description": "Leitura do mês já realizada"
                }
            }
        };
    }

    return { customer };
};

export const processImageAndGenerateMeasure = async (image: string, customer: any, measure_datetime: string, measure_type: string) => {
    const imagePath = `public/imgs/${customer.customer_code}_${measure_datetime}_${measure_type}.jpg`;
    saveBase64Image(image, imagePath);

    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
    const uploadResponse = await fileManager.uploadFile(imagePath, {
        mimeType: "image/jpeg",
        displayName: imagePath
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
        {
            fileData: {
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.uri
            }
        },
        { text: "Which number is in the picture, return me only the number?" },
    ]);

    const image_url = uploadResponse.file.uri;
    const measure_value = Number(result.response.text().match(/\d+/)[0]);
    const measure_uuid = uuidv4();

    const measure = await createMeasure({
        measure_uuid,
        measure_datetime,
        measure_type: measure_type.toUpperCase(),
        image_url,
        measure_value,
        customer: customer._id
    });

    const measureId: Types.ObjectId = measure._id as Types.ObjectId;

    await addMeasure(customer._id, measureId);

    return {
        image_url,
        measure_value,
        measure_uuid
    };
};


export const fetchCustomerMeasures = async (customer_code: string, measure_type: string | null) => {
    const customer = await getCustomerByCode(customer_code);;

    if (customer?.measures.length === 0) {
        return null;
    }

    const measures = measure_type
        ? await MeasureModel.find({ '_id': { $in: customer?.measures }, measure_type: measure_type.toUpperCase() })
        : await MeasureModel.find({ '_id': { $in: customer?.measures } });

    const formattedMeasures = measures.map(measure => ({
        measure_uuid: measure.measure_uuid,
        measure_datetime: measure.measure_datetime,
        measure_type: measure.measure_type,
        has_confirmed: measure.has_confirmed,
        image_url: measure.image_url
    }));

    const response = {
        customer_code: customer?.customer_code,
        measures: formattedMeasures
    };

    return response;
};
