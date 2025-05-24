import { PinataSDK } from "pinata";
import 'dotenv/config';

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
 pinataGateway: process.env.PINATA_GATEWAY,
});


// // Workers will upload the file to IPFS, then take their cid and submit it to blockchain
async function uploadFile() {
  try {
    const file = new File(["I have a feeling that somebody watching meeeeee..."], "despair.txt", { type: "text/plain" });
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
    console.log(data)

    const url = `${process.env.PINATA_GATEWAY}/ipfs/${cid}`;
    console.log("Access URL:", url);
  } catch (error) {
    console.log(error);
  }
}

uploadFile();
getFile("bafkreid2kwk3yoepscor4yckwngy5zuacfswkyfujs5tv6ls5jxxfk63gq");