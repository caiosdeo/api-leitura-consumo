import { Document, Schema, Types, Model, model } from 'mongoose';

import { getMonthStartAndEnd } from '../helpers';

interface IMeasure extends Document {
    measure_uuid: string;
    measure_datetime: Date;
    measure_type: 'WATER' | 'GAS';
    image_url: string;
    measure_value?: number;
    has_confirmed: boolean;
    customer: Types.ObjectId;
}

const MeasureSchema = new Schema<IMeasure>({
    measure_uuid: { type: String, required: true, unique: true },
    measure_datetime: { type: Date, required: true },
    measure_type: { type: String, enum: ['WATER', 'GAS'], required: true },
    image_url: { type: String, required: true },
    measure_value: { type: Number },
    has_confirmed: { type: Boolean, default: false },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true }
});

export const MeasureModel: Model<IMeasure> = model<IMeasure>('Measure', MeasureSchema);

export const createMeasure = async (values: any): Promise<IMeasure> => {
    const measure = new MeasureModel(values);
    return measure.save();
}

export const getMeasureByUUID = async (uuid: string): Promise<IMeasure | null> => {
    return MeasureModel.findOne({ measure_uuid: uuid }).exec();
}

export const confirmMeasureById = async (id: Types.ObjectId, value: number): Promise<IMeasure | null> => {
    return MeasureModel.findByIdAndUpdate(id, { has_confirmed: true, measure_value: value }, { new: true }).exec();
}

export const existsMeasureInMonth = async (customer: Types.ObjectId, type: string, dateStr: string) => {
    const date = new Date(dateStr);
    const { startOfMonth, endOfMonth } = getMonthStartAndEnd(date);

    const typeUpper = type.toUpperCase();

    const measures = await MeasureModel.find({ 
        customer: customer, measure_type: typeUpper,
        measure_datetime: { $gte: startOfMonth, $lte: endOfMonth }
    }).exec();

    return measures.length > 0;
}