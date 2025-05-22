import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: "PINATA_JWT",
  pinataGateway: "white-tragic-rook-965.mypinata.cloud",
});

// Workers will upload the file to IPFS, then take their cid and submit it to blockchain
async function uploadFile() {
  try {
    const file = new File(["hello world!"], "hello.txt", { type: "text/plain" });
    const upload = await pinata.upload.public.file(file);
    console.log(upload);
  } catch (error) {
    console.log(error);
  }
}

// When a Requester wants to review the data sent by the Workers, they will get the file from IPFS using the
// data hashes sent by the Workers (getDataHash).
// Data quality evaluation should only be plausible after a Task has been set as Reserved.
// Data quality evaluation is executed off-chain (js backend) and then the results are posted on-chain.
async function getFile() {
  try {
    const data = await pinata.gateways.public.get("bafkreibm6jg3ux5qumhcn2b3flc3tyu6dmlb4xa7u5bf44yegnrjhc4yeq");
    console.log(data)

    const url = await pinata.gateways.convert(
      "bafkreib4pqtikzdjlj4zigobmd63lig7u6oxlug24snlr6atjlmlza45dq"
    )
    console.log(url)
  } catch (error) {
    console.log(error);
  }
}