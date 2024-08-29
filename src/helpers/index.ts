import fs from 'fs';

import { getCustomerByCode, ICustomer } from "../db/customer";

export interface CustomError extends Error {
    code?: number;
    json?: object;
}

export const validateString = (value: any) => {
    if (typeof value !== "string" || !value.trim()) {
        const error: CustomError = new Error();
        error.code = 400;
        error.json = {
            error_code: "INVALID_DATA",
            error_description: `${value} is not a string`
        };
        throw error;
    } 
}

export const validateInteger = (value: any) => {
    if (!Number.isInteger(value)) {
        const error: CustomError = new Error();
        error.code = 400;
        error.json = {
            error_code: "INVALID_DATA",
            error_description: `${value} is not an integer`
        };
        throw error;
    } 
}

export const validateImage = (image: any) => {
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

    if (!base64regex.test(image)) {
        const error: CustomError = new Error();
        error.code = 400;
        error.json = {
            error_code: "INVALID_DATA",
            error_description: `Image is not Base64 Encoded`
        };
        throw error;
    } 
}

export const validateDate = (date: string) => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/

    if (!datePattern.test(date) || isNaN(Date.parse(date))) {
        const error: CustomError = new Error();
        error.code = 400;
        error.json = {
            error_code: "INVALID_DATA",
            error_description: `${date} is not a valid datetime format. Expected format is YYYY-MM-DD.`
        };
        throw error;
    }
}

export const validateMeasureType = (type: any, error_code = "INVALID_DATA", error_description = `${type} is not the type of WATER or GAS`) => {

    enum MeasureTypes {
        water = "WATER",
        gas = "GAS"
    }

    const upperCaseValue = type.toUpperCase();

    if (!Object.values(MeasureTypes).includes(upperCaseValue)) {
        const error: CustomError = new Error();
        error.code = 400;
        error.json = {
            error_code: error_code,
            error_description: error_description
        };
        throw error;
    } 
}

export const saveBase64Image = (base64String: string, outputPath: string) => {
    const buffer = Buffer.from(base64String, 'base64');
    fs.writeFileSync(outputPath, buffer);
}

export const getMonthStartAndEnd = (date: Date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { startOfMonth, endOfMonth };
};