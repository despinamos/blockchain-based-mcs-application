import { PinataSDK } from "pinata";
import 'dotenv/config';
import { dataValidation } from "./data_quality/DataQuality_Updated.cjs";
import * as fs from 'fs';

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
 pinataGateway: process.env.PINATA_GATEWAY,
});


// // Workers will upload the file to IPFS, then take their cid and submit it to blockchain
async function uploadFile() {
  try {
    const file = new File([10.1], "data8.txt", { type: "text/plain" });
    const upload = await pinata.upload.public.file(file);
    console.log(upload);
  } catch (error) {
    console.log(error);
  }
}

// // When a Requester wants to review the data sent by the Workers, they will get the file from IPFS using the
// // data hashes sent by the Workers (getDataHash).
// // Data quality evaluation should only be plausible after a Task has been set as Reserved.
// // Data quality evaluation is executed off-chain (js backend) and then the results are posted on-chain.
async function getFile(cid) {
  try { 
    const data = await pinata.gateways.public.get(cid);
    return data;

    // const url = `${process.env.PINATA_GATEWAY}/ipfs/${cid}`;
    // console.log("Access URL:", url);
  } catch (error) {
    console.log(error);
  }
}

let dataHashes = ["bafkreidzajuzxzbmrkhen653iuaxezix5bvsfrlkdcpxmjng3jeqqgzeke", 
  "bafkreickitobknscasua72aosa4ukxgbmcbidaqp4kze6hssgow6nly52u", 
  "bafkreigejfo2ouevyzf7jycypzc5oqtpjfwkj7e744qrc4kqau3bz7qaie", 
  "bafkreibmmjbdftosef3rffg7xmyqvsqabig7nlelm23jnwio6bx5563eum", 
  "bafkreifvfnqd7hwinq4cvbedzlkppchs7etvgwtwvujyrsxnz326hq6icm", 
  "bafkreicpzavsnlwli7jindco7prvqfzsupt4xtdmf35tebrmbalqubpoxa", 
  "bafkreihy7thx3w4bkcf7qx6au7isvccdp27gj5f3frxi5qhfwf4sloiihm", 
  "bafkreic22osxhbkacmofl6oh3f656zcebsejvnudv5zjjx5t2jky6eismm"]

async function calculateDataQuality(dataHashes) {

  let dataArray = []

  for (let i = 0; i < dataHashes.length; i++) {
    
    console.log("DataHash", dataHashes[i]);

    // extract data from file
    let userFileObject = await getFile(dataHashes[i]);
    console.log("User data from file: ", userFileObject);

    let value = userFileObject.data;
    console.log("Value: ", value)

    // add them in a new array
    dataArray.push(parseFloat(value));
    
  }

  let resultDataQuality = dataValidation(dataArray)
  
  console.log("Data array: ", dataArray);
  console.log("Cluster center: ", resultDataQuality.clusterCenter)
  console.log("Valid Data: ", resultDataQuality.validData)
  console.log("Worker indexes with valid data:", resultDataQuality.validIndexes);
  console.log("Worker indexes with invalid data:", resultDataQuality.nonValidIndexes);
}

//uploadFile();
//getFile("bafkreid2kwk3yoepscor4yckwngy5zuacfswkyfujs5tv6ls5jxxfk63gq");
calculateDataQuality(dataHashes);