// https://bafybeibj3udv2xg5ufytzuc2jxoczlwyv5pk6wvdgwrcnotppcyjf6vduu.ipfs.infura-ipfs.io/

const generateMetadata = (name, description, image, filename, encryptedFileUrl, accessControlConditions, encryptedSymmetricKey) => {
  return {
    name,
    description,
    image,
    filename,
    encryptedFileUrl,
    accessControlConditions,
    encryptedSymmetricKey,
  };
};
