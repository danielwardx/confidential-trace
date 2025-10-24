export const CONTRACT_ADDRESS = '0x749b19F59B2264f846cFf9D68bDB098CE63E31aD';

export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "timestamp",
        "type": "uint64"
      }
    ],
    "name": "VisitRecorded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getVisit",
    "outputs": [
      {
        "components": [
          {
            "internalType": "euint32",
            "name": "countryId",
            "type": "bytes32"
          },
          {
            "internalType": "euint32",
            "name": "cityId",
            "type": "bytes32"
          },
          {
            "internalType": "uint64",
            "name": "timestamp",
            "type": "uint64"
          }
        ],
        "internalType": "struct TravelRegistry.Visit",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getVisitCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getVisits",
    "outputs": [
      {
        "components": [
          {
            "internalType": "euint32",
            "name": "countryId",
            "type": "bytes32"
          },
          {
            "internalType": "euint32",
            "name": "cityId",
            "type": "bytes32"
          },
          {
            "internalType": "uint64",
            "name": "timestamp",
            "type": "uint64"
          }
        ],
        "internalType": "struct TravelRegistry.Visit[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "externalEuint32",
        "name": "encryptedCountryId",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint32",
        "name": "encryptedCityId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      },
      {
        "internalType": "uint64",
        "name": "travelTimestamp",
        "type": "uint64"
      }
    ],
    "name": "recordVisit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
