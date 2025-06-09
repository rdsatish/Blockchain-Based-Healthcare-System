# Blockchain Based Secure Interoperable Healthcare system

A simplified blockchain-based healthcare system built using **Hyperledger Fabric**, designed to enable **secure interoperability** between hospitals. The project ensures the safe exchange of sensitive patient data across hospital networks using a **permissioned blockchain** model, suitable for real-world healthcare applications.

---

## 🔐 Key Features

- **Hospital-Level Interoperability**: Each hospital operates as an independent organization within a secure, shared blockchain network.
- **Permissioned Network**: Built using Hyperledger Fabric to enforce access control and privacy.
- **Smart Contracts (Chaincode)**: Custom logic for managing patient data and transactions securely.
- **Privacy & Security**: Designed to ensure data confidentiality, integrity, and auditability across institutions.
- **Scalable Architecture**: Capable of handling increased transactions while maintaining low latency.

---

## ⚙️ Tech Stack

- **Blockchain Framework**: Hyperledger Fabric
- **Smart Contracts**: Chaincode written in JS
- **DevOps**: Docker & Docker Compose
- **Performance Tool**: Hyperledger Caliper (for benchmarking)

---

## 🛠️ Prerequisites

Before setting up the project, ensure the following tools are installed on your system:

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) 
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- [Go](https://go.dev/) (only if you wish to test Go-based chaincode variants)
- [Hyperledger Fabric binaries and samples](https://hyperledger-fabric.readthedocs.io/en/latest/install.html)

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/rdsatish/Blockchain-Based-Healthcare-System.git
   cd Blockchain-Based-Healthcare-System
   npm install

2. **Set up Fabric Network**
   ```bash
   cd fabric-sample/test-network
   ./network.sh up
   ./network.sh createChannel
   
4. **Deploy Chaincode to Fabric Network**
   ```bash
   ./network.sh deployCC -ccn chaincode_name -ccp chaincode_path -ccl javascript
   
---

## 💻 Interacting with Chaincode via CLI

After deploying your chaincode (`healthcare`) on `mychannel`, you can use the following CLI commands to invoke or query functions.

1. **Invoke InitDoctorLedger function from doctor's chaincode**
   ```bash
   peer chaincode invoke -o localhost:7050 \
   --ordererTLSHostnameOverride orderer.example.com \
   --tls \
   --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
   -C mychannel -n healthcare \
   --peerAddresses localhost:7051 \
   --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt \
   --peerAddresses localhost:9051 \
   --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt \
   -c '{"function":"InitDoctorLedger","Args":[]}'

3. **Query to get all the doctors**
   ```bash
   peer chaincode query -C mychannel -n healthcare -c '{"function":"GetAllDoctors","Args":[]}'
   
---


