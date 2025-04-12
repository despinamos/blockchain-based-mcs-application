import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import { fromString, toString } from 'uint8arrays';

// Create a Helia instance
async function createNode() {
    const helia = await createHelia();
    console.log("Helia node is ready!");
    return helia;
}

async function addFile(helia, content) {
  const fs = unixfs(helia);
  const cid = await fs.addBytes(fromString(content));
  console.log("Added file CID:", cid.toString());
  return cid.toString();
}

async function getFile(helia, cid) {
  const fs = unixfs(helia);
  let fileContent = "";

  for await (const chunk of fs.cat(cid)) {
      fileContent += toString(chunk);
  }

  console.log("Retrieved content:", fileContent);
  return fileContent;
}

// async function main() {
//   const helia = await createNode();
  
//   const content = "Hello, IPFS with Helia!";
//   const cid = await addFile(helia, content);
  
//   const retrievedContent = await getFile(helia, cid);

//   console.log("Final output:", retrievedContent);
// }

// main().catch(console.error);
