/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class DoctorCC extends Contract {

    async InitDoctorLedger(ctx) {
        const doctors = [
            {
                ID: 'Doctor1',
                Name: 'suue',
                Age: 52,
                Specialization: 'General physician',
                Contact: 91300000,
            },
            {
                ID: 'Doctor2',
                Name: 'su',
                Age: 30,
                Specialization: 'Dentist',
                Contact: 91400000,
            },
            {
                ID: 'Doctor3',
                Name: 'sueen',
                Age: 40,
                Specialization: 'physiotherapist',
                Contact: 91500000,
            },
            {
                ID: 'Doctor4',
                Name: 'sullow',
                Age: 32,
                Specialization: 'psychiatrist',
                Contact: 91600000,
            },
            {
                ID: 'Doctor5',
                Name: 'suack',
                Age: 45,
                Specialization: 'Veternary',
                Contact: 91700000,
            },
            {
                ID: 'Doctor6',
                Name: 'suite',
                Age: 35,
                Specialization: 'Cardiologist',
                Contact: 91800000,
            },
        ];

        for (const doctor of doctors) {
            doctor.docType = 'doctor';
            await ctx.stub.putState(doctor.ID, Buffer.from(JSON.stringify(doctor)));
            console.info(`Doctor ${doctor.ID} initialized`);
        }
    }

    // CreateDoctor issues a new doctor to the world state with given details.
    async CreateDoctor(ctx, id, name, age, specialization, contact) {
        const doctor = {
            ID: id,
            Name: name,
            Age: age,
            Specialization: specialization,
            Contact: contact,
        };
        ctx.stub.putState(id, Buffer.from(JSON.stringify(doctor)));
        return JSON.stringify(doctor);
    }

    // ReadDoctor returns the doctor stored in the world state with given id.
    async ReadDoctor(ctx, id) {
        const doctorJSON = await ctx.stub.getState(id); // get the doctor from chaincode state
        if (!doctorJSON || doctorJSON.length === 0) {
            throw new Error(`The doctor ${id} does not exist`);
        }
        return doctorJSON.toString();
    }

    // UpdateDoctor updates an existing doctor in the world state with provided parameters.
    async UpdateDoctor(ctx, id, name, age, specialization, contact) {
        const exists = await this.DoctorExists(ctx, id);
        if (!exists) {
            throw new Error(`The doctor ${id} does not exist`);
        }

        // overwriting original doctor with new doctor
        const updatedDoctor = {
            ID: id,
            Name: name,
            Age: age,
            Specialization: specialization,
            Contract: contact,
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedDoctor)));
    }

    // DeleteDoctor deletes an given doctor from the world state.
    async DeleteDoctor(ctx, id) {
        const exists = await this.DoctorExists(ctx, id);
        if (!exists) {
            throw new Error(`The doctor ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // DoctorExists returns true when doctor with given ID exists in world state.
    async DoctorExists(ctx, id) {
        const doctorJSON = await ctx.stub.getState(id);
        return doctorJSON && doctorJSON.length > 0;
    }

    async GetAllDoctors(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all doctors in the chaincode namespace.
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

module.exports = DoctorCC;
