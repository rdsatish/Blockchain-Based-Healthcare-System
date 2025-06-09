/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const patientCC = require('./lib/patientCC');
const doctorCC = require('./lib/doctorCC');
const hospitalCC = require('./lib/hospitalCC')
const rndCC = require('./lib/rndCC')
const medicalRecordCC = require('./lib/medicalRecordCC')




module.exports.contracts = [doctorCC, patientCC, hospitalCC, rndCC, medicalRecordCC];

