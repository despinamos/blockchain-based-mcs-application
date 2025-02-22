const { Helia } = require('@helia/core');
const { FilesystemDatastore } = require('@helia/filesystem-datastore');
const Web3 = require('web3');

// Initialize the Helia API
const datastore = new FilesystemDatastore();
const helia = await Helia.create({ datastore });

// Initialize the web3.js library
const web3 = new Web3('https://127.0.0.1:5001');

// Define the smart contract interface
const contractABI = [
  // Your contract ABI goes here
];

const contractAddress = '0x1234567890123456789012345678901234567890';
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Add a file to IPFS
const { createFile } = require('@helia/files');
const file = await createFile('document.pdf', 'PDF content');
const cid = await helia.add(file);

// Store the IPFS CID in the smart contract
await contract.methods.storeDocument(cid.toString()).send({ from: 'YOUR_ETHEREUM_ADDRESS' });

// Retrieve the IPFS CID from the smart contract
const storedCID = await contract.methods.getDocument().call();

// Retrieve the file from IPFS
const retrievedFile = await helia.get(storedCID);
console.log(await retrievedFile.content());
