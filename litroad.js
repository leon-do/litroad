class LitRoad {
  async buy(metadataUrl) {
    // fetch metadata from decentralized storage
    const { filename, encryptedFileUrl, encryptedSymmetricKey, accessControlConditions } = await fetch(metadataUrl).then((res) => res.json());
    const chain = accessControlConditions[0].chain;
    // sign with metamask
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    // fetch encrypted file from decentralized storage
    const file = await fetch(encryptedFileUrl).then((res) => res.blob());
    // obtain decrypted symmetric key
    const symmetricKey = await window.litNodeClient.getEncryptionKey({
      accessControlConditions,
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

  async sell(args) {
    this.chain = args.chain;
    this.name = args.name;
    this.description = args.description;
    this.image = args.image;
    this.wei = args.wei;
    this.file = args.file;
    this.image = args.image;
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

  async #encryptFile(_file) {
    // sign with metamask
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: this.chain });
    // encrypt file
    const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({ file: _file });
    const accessControlConditions = this.#generateAccessControlConditions();
    const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
      accessControlConditions,
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
      filename: this.filename,
      encryptedFileUrl: this.encryptedFileUrl,
      accessControlConditions: this.#generateAccessControlConditions(),
      encryptedSymmetricKey: this.encryptedSymmetricKey,
    };
  }

  #generateAccessControlConditions = () => {
    // https://developer.litprotocol.com/AccessControlConditions/EVM/basicExamples
    return [
      {
        contractAddress: this.#getContractAddress(),
        standardContractType: "",
        chain: this.chain,
        method: "eth_getBalance",
        parameters: [":userAddress", "latest"],
        returnValueTest: {
          comparator: ">=",
          value: this.wei,
        },
      },
    ];
  };

  #getContractAddress() {
    const contractAddress = {
      ethereum: "0xeth",
      goerli: "0xgoerli",
      polygon: "0xpoly",
      arbitrium: "0xarbitrium",
    };
    return contractAddress[this.chain];
  }
}
