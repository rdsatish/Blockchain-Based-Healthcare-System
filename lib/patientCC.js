/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class PatientCC extends Contract {

    async InitPatientLedger(ctx) {
        const patients = [
            {
                ID: "Patient1",
                Name: "suue",
                Age: 52,
                Address: "Tomoko",
                Contact: 300,
                Hospital: "Hospital1",
                Write: ["Doctor1"],
                Read: ["Doctor2"],
                RecordIDs: []
            },
            {
                ID: 'Patient2',
                Name: 'su',
                Age: 50,
                Address: 'Brad',
                Contact: 400,
                Hospital: 'Hospital1',
                Write: ["Doctor1"],
                Read: ["Doctor2"],
            },
            {
                ID: 'Patient3',
                Name: 'sueen',
                Age: 40,
                Address: 'Jin Soo',
                Contact: 500,
                Hospital: 'Hospital1',
                Write: ["Doctor1"],
                Read: ["Doctor2"],
            },
            {
                ID: 'Patient4',
                Name: 'sullow',
                Age: 50,
                Address: 'Max',
                Contact: 600,
                Hospital: 'Hospital2',
                Write: ["Doctor1"],
                Read: ["Doctor2"],
            },
            {
                ID: 'Patient5',
                Name: 'suack',
                Age: 45,
                Address: 'Adriana',
                Contact: 700,
                Hospital: 'Hospital12',
                Write: ["Doctor1"],
                Read: ["Doctor2"],
            },
            {
                ID: 'Patient6',
                Name: 'suite',
                Age: 55,
                Address: 'Michel',
                Contact: 800,
                Hospital: 'Hospital2',
                Write: ["Doctor1"],
                Read: ["Doctor2"],
            },
        ];

        for (const patient of patients) {
            patient.docType = 'patient';
            await ctx.stub.putState(patient.ID, Buffer.from(JSON.stringify(patient)));
            console.info(`Patient ${patient.ID} initialized`);
        }
    }

    // CreatePatient issues a new patient to the world state with given details.
    async CreatePatient(ctx, id, name, age, address, contact, hospital, writeAccessJSON, readAccessJSON) {
        const writeAccess = JSON.parse(writeAccessJSON); // Example: '["Doctor1"]'
        const readAccess = JSON.parse(readAccessJSON);   // Example: '["Doctor2"]'
    
        const patient = {
            ID: id,
            Name: name,
            Age: parseInt(age),
            Address: address,
            Contact: parseInt(contact),
            Hospital: hospital,
            Write: writeAccess,
            Read: readAccess,
            RecordIDs: []
        };
    
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(patient)));
        return JSON.stringify(patient);
    }    

    // ReadPatient returns the patient stored in the world state with given id.
    async ReadPatient(ctx, id) {
        const patientJSON = await ctx.stub.getState(id); // get the patient from chaincode state
        if (!patientJSON || patientJSON.length === 0) {
            throw new Error(`The patient ${id} does not exist`);
        }
        return patientJSON.toString();
    }

    // UpdatePatient updates an existing patient in the world state with provided parameters.
    async UpdatePatient(ctx, id, name, age, address, contact, hospital) {
        const exists = await this.PatientExists(ctx, id);
        if (!exists) {
            throw new Error(`The patient ${id} does not exist`);
        }

        // overwriting original patient with new patient
        const updatedPatient = {
            ID: id,
            Name: name,
            Age: age,
            Address: address,
            Contract: contact,
            Hospital: hospital,
            ID: id,
            Name: name,
            Age: parseInt(age),
            Address: address,
            Contact: parseInt(contact),
            Hospital: hospital,
            Write: writeAccess,
            Read: readAccess,
            RecordIDs: []
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedPatient)));
    }

    // DeletePatient deletes an given patient from the world state.
    async DeletePatient(ctx, id) {
        const exists = await this.PatientExists(ctx, id);
        if (!exists) {
            throw new Error(`The patient ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // PatientExists returns true when patient with given ID exists in world state.
    async PatientExists(ctx, id) {
        const patientJSON = await ctx.stub.getState(id);
        return patientJSON && patientJSON.length > 0;
    }

    // TransferPatient updates the owner field of patient with given id in the world state.
    async TransferPatient(ctx, id, newHospital) {
        const patientString = await this.ReadPatient(ctx, id);
        const patient = JSON.parse(patientString);
        patient.Hospital = newHospital;
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(patient)));
    }

    // GetAllPatients returns all patients found in the world state.
    async GetAllPatients(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all patients in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }


}

module.exports = PatientCC;
