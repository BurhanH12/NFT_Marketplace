import Web3 from 'web3';
import Web3Modal from 'web3modal';

let web3;

export async function connect() {
  const web3Modal = new Web3Modal({
    network: 'testnet',
    cacheProvider: 'true',
  });

  const provider = await web3Modal.connect();
  web3 = new Web3(provider);

  const accounts = await web3.eth.getAccounts();
  const address = accounts[0];
  setAccount(address);

  const balance = await web3.eth.getBalance(address);
  const balanceInEther = web3.utils.fromWei(balance, 'ether');
  setBalance(balanceInEther);

  const network = await web3.eth.net.getNetworkType();
  console.log('web3: ', web3);
  console.log('Address: ', address);
  console.log('Balance in Ether: ', balanceInEther);
  console.log(network);

  if (network === 'main') {
    setSign('ETH');
  } else if (network === 'private') {
    setSign('MATIC');
  }
}

export function getWeb3() {
  return web3;
}
