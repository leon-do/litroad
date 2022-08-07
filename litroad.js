class LitRoad {
  async sell(args) {
    this.chain = args.chain;
    this.name = args.name;
    this.description = args.description;
    this.image = args.image;
    this.price = args.price;
    this.file = args.file;
    this.image = args.image;
    this.itemId = this.#generateRandomNumber();
    // upload image decentralized storage and get back url
    this.imageUrl = await this.#uploadFile(this.image);
    // encrypt file
    const encryptedFile = await this.#encryptFile(this.file);
    // upload encrypted file decentralized storage and get back url
    this.encryptedFileUrl = await this.#uploadFile(encryptedFile);
    // generate metadata and get back url
    const metadata = this.#generateMetadata();
    // https://bafybeiexzwmq3jxexlbv2tgfzkmu47t3u35h5q4q5ftcjixxy5eaizl3i4.ipfs.infura-ipfs.io/
    this.metadataUrl = await this.#uploadJson(metadata);
    return this.metadataUrl;
  }

  async buy(metadataUrl) {
    // fetch metadata from decentralized storage
    const { filename, chain, encryptedFileUrl, encryptedSymmetricKey, evmContractConditions } = await fetch(metadataUrl).then((res) => res.json());
    // sign with metamask
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    // fetch encrypted file from decentralized storage
    const file = await fetch(encryptedFileUrl).then((res) => res.blob());
    // obtain decrypted symmetric key
    const symmetricKey = await window.litNodeClient.getEncryptionKey({
      evmContractConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    });
    // decrypt file
    const decryptedFile = await LitJsSdk.decryptFile({
      file,
      symmetricKey,
    });
    // download file
    LitJsSdk.downloadFile({
      filename,
      data: new Uint8Array(decryptedFile),
      memetype: "application/octet-stream",
    });
  }

  async #encryptFile(_file) {
    // sign with metamask
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: this.chain });
    this.seller = authSig.address;
    // encrypt file
    const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({ file: _file });
    const evmContractConditions = this.#generateEvmContractConditions();
    const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
      evmContractConditions,
      symmetricKey,
      authSig,
      chain: this.chain,
    });
    // included in metadata
    this.filename = _file.name;
    this.encryptedSymmetricKey = LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16");
    return encryptedFile;
  }

  async #uploadFile(_file) {
    // upload file to decentralized storage and get back url
    const formData = new FormData();
    formData.append("file", _file);
    const response = await fetch("https://ipfs.infura.io:5001/api/v0/add?pin=true", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
    return `https://ipfs.infura.io/ipfs/${response.Hash}`;
  }

  async #uploadJson(_json) {
    // upload json to decentralized storage and get back url
    const formData = new FormData();
    formData.append("json", new Blob([JSON.stringify(_json)], { type: "application/json" }));
    const response = await fetch("https://ipfs.infura.io:5001/api/v0/add?pin=true", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
    return `https://ipfs.infura.io/ipfs/${response.Hash}`;
  }

  #generateMetadata() {
    return {
      name: this.name,
      description: this.description,
      imageUrl: this.imageUrl,
      chain: this.chain,
      price: this.price,
      seller: this.seller,
      itemId: this.itemId,
      filename: this.filename,
      encryptedFileUrl: this.encryptedFileUrl,
      evmContractConditions: this.#generateEvmContractConditions(),
      encryptedSymmetricKey: this.encryptedSymmetricKey,
    };
  }

  #getContractAddress() {
    const contractAddress = {
      ethereum: "0xeth",
      goerli: "0x25Ba45202257e16117db55571eaBb236A07cAE90",
      polygon: "0xpoly",
      arbitrium: "0xarbitrium",
    };
    return contractAddress[this.chain];
  }

  #generateRandomNumber() {
    // generate a uint256ish randomish numberish string
    let num = "";
    for (let i = 0; i < 77; i++) {
      const random = Math.floor(Math.random() * 10);
      num += random;
    }
    return num;
  }

  #generateEvmContractConditions = () => {
    // https://developer.litprotocol.com/AccessControlConditions/EVM/customContractCalls
    return [
      {
        contractAddress: this.#getContractAddress(),
        chain: this.chain,
        functionName: "items",
        functionParams: [this.itemId],
        functionAbi: {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "items",
          outputs: [
            {
              internalType: "address",
              name: "seller",
              type: "address",
            },
            {
              internalType: "address",
              name: "investor",
              type: "address",
            },
            {
              internalType: "string",
              name: "uri",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        returnValueTest: {
          key: "seller",
          comparator: "=",
          value: this.seller,
        },
      },
      { operator: "and" },
      {
        contractAddress: this.#getContractAddress(),
        chain: this.chain,
        functionName: "items",
        functionParams: [this.itemId],
        functionAbi: {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "items",
          outputs: [
            {
              internalType: "address",
              name: "seller",
              type: "address",
            },
            {
              internalType: "address",
              name: "investor",
              type: "address",
            },
            {
              internalType: "string",
              name: "uri",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "price",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        returnValueTest: {
          key: "price",
          comparator: "=",
          value: this.price,
        },
      },
      { operator: "and" },
      {
        contractAddress: this.#getContractAddress(),
        chain: this.chain,
        functionName: "purchase",
        functionParams: [this.itemId, ":userAddress"],
        functionAbi: {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "purchase",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        returnValueTest: {
          key: "",
          comparator: "=",
          value: "true",
        },
      },
    ];
  };
}
