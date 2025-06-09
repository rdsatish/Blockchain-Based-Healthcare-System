const { Contract } = require('fabric-contract-api');
'use strict';

class MedicalRecordCC extends Contract {

    async createMedicalRecord(ctx, recordID, patientID, doctorID, date, prescription) {
        if (!recordID || !patientID || !doctorID || !date || !prescription) {
            throw new Error('Missing required arguments');
        }

        const medicalRecordJSON = await ctx.stub.getState(recordID);
        if (medicalRecordJSON && medicalRecordJSON.length > 0) {
            throw new Error(`The medical record with ID ${recordID} already exists`);
        }

        const patientJSON = await ctx.stub.getState(patientID);
        if (!patientJSON || patientJSON.length === 0) {
            throw new Error(`Patient with ID ${patientID} does not exist`);
        }

        const doctorJSON = await ctx.stub.getState(doctorID);
        if (!doctorJSON || doctorJSON.length === 0) {
            throw new Error(`Doctor with ID ${doctorID} does not exist`);
        }

        const patient = JSON.parse(patientJSON.toString());
        if (!patient.Write.includes(doctorID)) {
            throw new Error(`Doctor ${doctorID} does not have write access to patient ${patientID}`);
        }

        const medicalRecord = {
            ID: recordID,
            PatientID: patientID,
            DoctorID: doctorID,
            Date: date,
            Prescription: prescription,
        };

        await ctx.stub.putState(recordID, Buffer.from(JSON.stringify(medicalRecord)));

        patient.RecordIDs.push(recordID);
        await ctx.stub.putState(patientID, Buffer.from(JSON.stringify(patient)));

        return `Medical record ${recordID} created for patient ${patientID}`;
    }

    async deleteMedicalRecord(ctx, patientID, recordID) {
        const patientJSON = await ctx.stub.getState(patientID);
        if (!patientJSON || patientJSON.length === 0) {
            throw new Error(`Patient with ID ${patientID} does not exist`);
        }

        const medicalRecordJSON = await ctx.stub.getState(recordID);
        if (!medicalRecordJSON || medicalRecordJSON.length === 0) {
            throw new Error(`Medical record with ID ${recordID} does not exist`);
        }

        const patient = JSON.parse(patientJSON.toString());
        const recordIndex = patient.RecordIDs.indexOf(recordID);
        if (recordIndex === -1) {
            throw new Error(`Medical record ${recordID} not found for patient ${patientID}`);
        }

        patient.RecordIDs.splice(recordIndex, 1);
        await ctx.stub.putState(patientID, Buffer.from(JSON.stringify(patient)));

        await ctx.stub.deleteState(recordID);

        return `Medical record ${recordID} deleted for patient ${patientID}`;
    }

    async getAllMedicalRecordsByPatientID(ctx, patientID) {
        const patientJSON = await ctx.stub.getState(patientID);
        if (!patientJSON || patientJSON.length === 0) {
            throw new Error(`Patient with ID ${patientID} does not exist`);
        }

        const patient = JSON.parse(patientJSON.toString());
        const medicalRecords = [];

        for (const recordID of patient.RecordIDs) {
            const medicalRecordJSON = await ctx.stub.getState(recordID);
            if (medicalRecordJSON && medicalRecordJSON.length > 0) {
                medicalRecords.push(JSON.parse(medicalRecordJSON.toString()));
            }
        }

        return medicalRecords;
    }

    async getMedicalRecordByID(ctx, recordID) {
        const medicalRecordJSON = await ctx.stub.getState(recordID);
        if (!medicalRecordJSON || medicalRecordJSON.length === 0) {
            throw new Error(`Medical record with ID ${recordID} does not exist`);
        }

        return JSON.parse(medicalRecordJSON.toString());
    }
}

module.exports = MedicalRecordCC;
