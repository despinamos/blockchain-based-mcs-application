const { createHelia } = require('helia');
const { unixfs } = require('@helia/unixfs');

async function uploadFile(file) {
    const helia = await createHelia()
    console.log('IPFS node started')
    
    try {
        const fs = unixfs(helia)
        const cid = await fs.addBytes(file)
        console.log('File CID:', cid)
    }catch(error) {
        console.error('Something went wrong with IPFS upload: ', error)
    }
}

uploadFile(file)