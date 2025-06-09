/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class RnDCC extends Contract {

    async InitRnDLedger(ctx) {
        const researchers = [
            {
                ID: 'Researcher1',
                Name: 'John',
                Age: 52,
                Address: 'Tomoko',
                Contact: 300,
            },
            {
                ID: 'Researcher2',
                Name: 'Jack',
                Age: 50,
                Address: 'Brad',
                Contact: 400,
            },
            {
                ID: 'Researcher3',
                Name: 'Suzen',
                Age: 40,
                Address: 'Jin Soo',
                Contact: 500,
            },
            {
                ID: 'Researcher4',
                Name: 'Sallow',
                Age: 50,
                Address: 'Max',
                Contact: 600,
            },
            {
                ID: 'Researcher5',
                Name: 'Sanck',
                Age: 45,
                Address: 'Adriana',
                Contact: 700,
            },
            {
                ID: 'Researcher6',
                Name: 'sk',
                Age: 55,
                Address: 'Michel',
                Contact: 800,
            },
        ];

        for (const researcher of researchers) {
            researcher.docType = 'researcher';
            await ctx.stub.putState(researcher.ID, Buffer.from(JSON.stringify(researcher)));
            console.info(`Insurance Provider ${researcher.ID} initialized`);
        }
    }

    // CreateResearcher issues a new researcher to the world state with given details.
    async CreateResearcher(ctx, id, name, age, address, contact) {
        const researcher = {
            ID: id,
            Name: name,
            Age: age,
            Address: address,
            Contact: contact,
        };
        ctx.stub.putState(id, Buffer.from(JSON.stringify(researcher)));
        return JSON.stringify(researcher);
    }

    // ReadResearcher returns the researcher stored in the world state with given id.
    async ReadResearcher(ctx, id) {
        const insuranceProviderJSON = await ctx.stub.getState(id); // get the researcher from chaincode state
        if (!insuranceProviderJSON || insuranceProviderJSON.length === 0) {
            throw new Error(`The researcher ${id} does not exist`);
        }
        return insuranceProviderJSON.toString();
    }

    // UpdateResearcher updates an existing researcher in the world state with provided parameters.
    async UpdateResearcher(ctx, id, name, age, address, contact) {
        const exists = await this.researcherExists(ctx, id);
        if (!exists) {
            throw new Error(`The researcher ${id} does not exist`);
        }

        // overwriting original researcher with new researcher
        const updatedResearcher = {
            ID: id,
            Name: name,
            Age: age,
            Address: address,
            Contract: contact,
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedResearcher)));
    }

    // DeleteResearcher deletes an given researcher from the world state.
    async DeleteResearcher(ctx, id) {
        const exists = await this.researcherExists(ctx, id);
        if (!exists) {
            throw new Error(`The researcher ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // researcherExists returns true when researcher with given ID exists in world state.
    async researcherExists(ctx, id) {
        const insuranceProviderJSON = await ctx.stub.getState(id);
        return insuranceProviderJSON && insuranceProviderJSON.length > 0;
    }

    async GetAllResearcher(ctx) {
        const allResults = [];
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

module.exports = RnDCC;
