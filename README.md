# LitRoad

How to use `litroad.js`

## Import

```html
<script onload="LitJsSdk.litJsSdkLoadedInALIT()" src="https://jscdn.litgateway.com/index.web.js"></script>

<script src="./litroad.js"></script>
```

## Uploading a File

Provide chain, name, description etc. Returns a url (metadataUrl)

```javascript
async function upload() {
  const litRoad = await new LitRoad();
  const metadataUrl = await litRoad.upload({
    chain: "ethereum",
    name: "Name of Item",
    description: "What the item does",
    price: "1000000000000000000", // in smallest unit
    image: document.getElementById("image").files[0],
    file: document.getElementById("file").files[0],
  });
  document.getElementById("metadataUrlDiv").innerHTML = metadataUrl;

  // https://ipfs.infura.io/ipfs/QmNTysYtyArCAYrh9WDzyzLZP9qimwd2aYgnAnvUrRFAMD
  console.log(metadataUrl);
}
```

## Downloading a File

Use the url to purchase

```javascript
async function buy() {
  const metadataUrl = "https://bafybeif2elp457ueq3z4dp244x5gfptfo7hyxtzz6gbwodqd7f5m5c7kcu.ipfs.infura-ipfs.io/";
  const litRoad = await new LitRoad();
  const metadata = await litRoad.download(metadataUrl);
}
```

## Metadata URL

Example: https://bafybeif2elp457ueq3z4dp244x5gfptfo7hyxtzz6gbwodqd7f5m5c7kcu.ipfs.infura-ipfs.io/

`name` is for UI

`description` is for UI

`imageUrl` is for UI

`chain` is for litroad network switching/evm contract conditions

`price` is to check if lit conditions (price) match smart contract

`seller` is to check if lit conditions (seller address) match smart contract

`itemId` is a unique identifier. check if lit conditions match smart contract

`filename` is the name of encrypted file

`encryptedFileUrl` is the url to download the encrypted file

`evmContractConditions` is part of lit protocol. Used to gate content. All conditions must me true:

- Check if `itemId` has correct `seller` address
- Check if `itemId` has correct `price` in smallest unit (ie wei)
- Check if buyer purchased item by calling `purchase[tokenId][:userAddress]`

`encryptedSymmetricKey` is used to decrypt the file if EVM control conditions are true
