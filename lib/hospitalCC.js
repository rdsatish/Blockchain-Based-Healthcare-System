/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class HospitalCC extends Contract {

    async InitLedger(ctx) {
        const hospitals = [
            {
                ID: 'Hospital1',
                Name: 'suue',
                PatientID: 52,
                Address: 'Tomoko',
                Contact: 300,
            },
            {
                ID: 'Hospital2',
                Name: 'su',
                PatientID: 50,
                Address: 'Brad',
                Contact: 400,
            },
            {
                ID: 'Hospital3',
                Name: 'sueen',
                PatientID: 40,
                Address: 'Jin Soo',
                Contact: 500,
            },
            {
                ID: 'Hospital4',
                Name: 'sullow',
                PatientID: 50,
                Address: 'Max',
                Contact: 600,
            },
            {
                ID: 'Hospital5',
                Name: 'suack',
                PatientID: 45,
                Address: 'Adriana',
                Contact: 700,
            },
            {
                ID: 'Hospital6',
                Name: 'suite',
                PatientID: 55,
                Address: 'Michel',
                Contact: 800,
            },
        ];

        for (const hospital of hospitals) {
            hospital.docType = 'hospital';
            await ctx.stub.putState(hospital.ID, Buffer.from(JSON.stringify(hospital)));
            console.info(`Hospital ${hospital.ID} initialized`);
        }
    }

    // CreateHospital issues a new hospital to the world state with given details.
    async CreateHospital(ctx, id, name, patientID, address, contact) {
        const hospital = {
            ID: id,
            Name: name,
            PatientID: patientID,
            Address: address,
            Contact: contact,
        };
        ctx.stub.putState(id, Buffer.from(JSON.stringify(hospital)));
        return JSON.stringify(hospital);
    }

    // ReadHospital returns the hospital stored in the world state with given id.
    async ReadHospital(ctx, id) {
        const hospitalJSON = await ctx.stub.getState(id); // get the hospital from chaincode state
        if (!hospitalJSON || hospitalJSON.length === 0) {
            throw new Error(`The hospital ${id} does not exist`);
        }
        return hospitalJSON.toString();
    }

    // UpdateHospital updates an existing hospital in the world state with provided parameters.
    async UpdateHospital(ctx, id, name, patientID, address, contact) {
        const exists = await this.HospitalExists(ctx, id);
        if (!exists) {
            throw new Error(`The hospital ${id} does not exist`);
        }

        // overwriting original hospital with new hospital
        const updatedHospital = {
            ID: id,
            Name: name,
            PatientID: patientID,
            Address: address,
            Contract: contact,
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedHospital)));
    }

    // DeleteHospital deletes an given hospital from the world state.
    async DeleteHospital(ctx, id) {
        const exists = await this.HospitalExists(ctx, id);
        if (!exists) {
            throw new Error(`The hospital ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // HospitalExists returns true when hospital with given ID exists in world state.
    async HospitalExists(ctx, id) {
        const hospitalJSON = await ctx.stub.getState(id);
        return hospitalJSON && hospitalJSON.length > 0;
    }

    // TransferHospital updates the owner field of hospital with given id in the world state.
    // async TransferHospital(ctx, id, newOwner) {
    //     const hospitalString = await this.ReadHospital(ctx, id);
    //     const hospital = JSON.parse(hospitalString);
    //     hospital.Owner = newOwner;
    //     return ctx.stub.putState(id, Buffer.from(JSON.stringify(hospital)));
    // }

    // GetAllHospitals returns all hospitals found in the world state.
    async GetAllHospitals(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all hospitals in the chaincode namespace.
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

module.exports = HospitalCC;
