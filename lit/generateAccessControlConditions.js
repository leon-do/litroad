// https://developer.litprotocol.com/AccessControlConditions/EVM/basicExamples

const generateAccessControlConditions = (chain, wei) => {
  const contractAddress = contractAddresses[chain];
  return [
    {
      contractAddress,
      standardContractType: "",
      chain,
      method: "eth_getBalance",
      parameters: [":userAddress", "latest"],
      returnValueTest: {
        comparator: ">=",
        value: wei,
      },
    },
  ];
};
