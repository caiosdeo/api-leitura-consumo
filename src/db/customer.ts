import { Document, Schema, Model, model, Types } from 'mongoose';

export interface ICustomer extends Document {
    customer_code: string;
    measures: Types.ObjectId[];
}

const customerSchema = new Schema<ICustomer>({
    customer_code: { type: String, required: true },
    measures: [{ type: Schema.Types.ObjectId, ref: 'Measure' }]
});

export const CustomerModel: Model<ICustomer> = model<ICustomer>('Customer', customerSchema);

export const getCustomerByCode = async (code: string): Promise<ICustomer | null> => {
    return CustomerModel.findOne({ customer_code: code })
        .populate('measures')
        .exec();
}

export const createCustomer = async (values: any): Promise<ICustomer> => {
    const customer = new CustomerModel(values);
    return customer.save();
}

export const addMeasure = async (id: Types.ObjectId, measureId: Types.ObjectId): Promise<ICustomer | null> => {
    return CustomerModel.findByIdAndUpdate(id, { $push: { measures: measureId } }, { new: true }).exec();
};