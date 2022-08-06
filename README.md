# LitRoad

How to use `litroad.js`

## Import

```html
<script onload="LitJsSdk.litJsSdkLoadedInALIT()" src="https://jscdn.litgateway.com/index.web.js"></script>

<script src="./litroad.js"></script>
```

## Selling a File.

Provide chain, name, description etc. Returns a url (metadataUrl)

```javascript
async function sell() {
  const litRoad = await new LitRoad();
  const metadataUrl = await litRoad.sell({
    chain: "ethereum",
    name: "Name of Item",
    description: "What the item does",
    wei: "1000000000000000000",
    image: document.getElementById("image").files[0],
    file: document.getElementById("file").files[0],
  });
  document.getElementById("metadataUrlDiv").innerHTML = metadataUrl;

  // https://ipfs.infura.io/ipfs/QmNTysYtyArCAYrh9WDzyzLZP9qimwd2aYgnAnvUrRFAMD
  console.log(metadataUrl);
}
```

## Buy

Use the url to purchase

```javascript
async function buy() {
  const metadataUrl = "https://ipfs.infura.io/ipfs/QmNTysYtyArCAYrh9WDzyzLZP9qimwd2aYgnAnvUrRFAMD";
  const litRoad = await new LitRoad();
  const metadata = await litRoad.buy(metadataUrl);
}
```

## Metadata URL

`name`, `description`, `imageUrl` are used to build the UI

`filename` is the name of encrypted file

`encryptedFileUrl` is the url to download the encrypted file

`accessControlConditions` is part of lit protocol. Used to gate content.

`encryptedSymmetricKey` is used to decrypt the file if access control conditions are true

```json
{
  "name": "Name of Item",
  "description": "What the item does",
  "imageUrl": "https://ipfs.infura.io/ipfs/QmaFT6fi1rmWcJcfpDrrwRsT1Dbp5juLVpSuCw9vaZkDbT",
  "filename": "original.png",
  "encryptedFileUrl": "https://ipfs.infura.io/ipfs/QmS6jat99vreupR2ydMVvea2y9LfwkmHimS4eaHtjypsvG",
  "accessControlConditions": [
    {
      "contractAddress": "",
      "standardContractType": "",
      "chain": "ethereum",
      "method": "eth_getBalance",
      "parameters": [":userAddress", "latest"],
      "returnValueTest": {
        "comparator": ">=",
        "value": "1000000000000000000"
      }
    }
  ],
  "encryptedSymmetricKey": "3edd96a07bee97e4fc6f7dca68d077f7c904618eb14b5f324d405e995bca86a9da3a3c2ebdcc9d303402da7e237d7f0e95ab9472b9d824e374268383a69dff45b0f20591a8d11d32df8872db1f611710016ff3fe2b7accbf1a6bdb4a6832d9a668766dff506f1bf9046827045da9c7c4396910197c906f991066c8040aee50d70000000000000020e2f9dc80385829da3edfd4d0ec89c2ce790ada97743113c1a56e8b4489ecacd3a23a164a432e97bdff49a652d0745982"
}
```
