import { Types } from 'mongoose';
import { getMeasureByUUID, confirmMeasureById } from '../db/measure';

export const confirmMeasure = async (measure_uuid: string, confirmed_value: number) => {
    const measure = await getMeasureByUUID(measure_uuid);

    if (!measure) {
        return {
            error: {
                code: 404,
                json: {
                    "error_code": "MEASURE_NOT_FOUND",
                    "error_description": "Leitura não encontrada"
                }
            }
        };
    }

    if (measure.has_confirmed) {
        return {
            error: {
                code: 409,
                json: {
                    "error_code": "CONFIRMATION_DUPLICATE",
                    "error_description": "Leitura do mês já confirmada"
                }
            }
        };
    }

    const measureId: Types.ObjectId = measure._id as Types.ObjectId;
    await confirmMeasureById(measureId, confirmed_value);

    return { success: true };
};
