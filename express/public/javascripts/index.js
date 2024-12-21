// Initialise the page objects to interact with
const ethereumButton = document.querySelector('.enableEthereumButton');
const showAccount = document.querySelector('.showAccount');
const showChainId = document.querySelector('.showChainId');

// Initialise the active account and chain id
let activeAccount;
let activeChainId;

// Update the account and chain id when user clicks on button
ethereumButton.addEventListener('click', () => {
  getAccount();
  getChainId();
});

async function userRegistration(userInfo) {

    const x = document.getElementById("Geo");
    // calculates a cloaked version of the user's location
    navigator.getCurrentPosition()(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    } )

    const gridX = Math.floor(latitude / gridSize);
    const gridY = Math.floor(longitude / gridSize);
    const cloakedLatitude = gridX * gridSize + gridSize / 2;
    const cloakedLongitude = gridY * gridSize + gridSize / 2;

    try {
        const userName = "Melina";
        const userLocationLatitude = cloakedLatitude;
        const userLocationLongitude = cloakedLongitude;
        const userReg = await userInfo.setUser_Information(userName, userLocationLatitude, userLocationLongitude);
        await userReg.wait(); // Wait for transaction confirmation
        const userData = await userInfo.getUserInformation(0);
        x.innerHTML ="User Name and Reputation: " + userData +
        "<br> Cloaked Latitude: " + cloakedLatitude +
        "<br> Cloaked Longitude: " + cloakedLongitude;
    } catch (error) {
        console.error('Error reading data:', error);
    }
}

// Get the account in the window object
async function getAccount() {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  if (accounts.length === 0) {
    // MetaMask is locked or the user has not connected any accounts
    console.log('Please connect to MetaMask.');
  } else if (accounts[0] !== activeAccount) {
    activeAccount = accounts[0];
  }
  showAccount.innerHTML = activeAccount;
}

// Get the connected network chainId
async function getChainId() {
    activeChainId = await ethereum.request({ method: 'eth_chainId' });
    showChainId.innerHTML = activeChainId;
}

// Update the selected account and chain id on change
ethereum.on('accountsChanged', getAccount);
ethereum.on('chainChanged', getChainId);

