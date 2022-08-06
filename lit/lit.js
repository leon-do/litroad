const lit = {
  encryptFile: async (file, chain, wei) => {
    // sign with metamask
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    // encrypt file
    const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({ file });
    const accessControlConditions = generateAccessControlConditions(chain, wei);
    const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });
    return {
      encryptedFile,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"),
      accessControlConditions,
    };
  },
  decryptFile: async (metadataUrl, chain) => {
    // sign with metamask
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    // fetch metadata from decentralized storage
    const { filename, encryptedFileUrl, encryptedSymmetricKey, accessControlConditions } = await fetch(metadataUrl).then((res) => res.json());
    // fetch encrypted file from decentralized storage
    const file = await fetch(encryptedFileUrl).then((res) => res.blob());
    // obtain decrypted symmetric key
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    });
    const decryptedFile = await LitJsSdk.decryptFile({
      file,
      symmetricKey,
    });
    LitJsSdk.downloadFile({
      filename,
      data: new Uint8Array(decryptedFile),
      memetype: "application/octet-stream",
    });
  },
};
