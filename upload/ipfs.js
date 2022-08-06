const ipfs = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("https://ipfs.infura.io:5001/api/v0/add?pin=true", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
    const url = `https://ipfs.infura.io/ipfs/${response.Hash}`;
    return url;
  },
  uploadJson: async (json) => {
    const formData = new FormData();
    formData.append("json", new Blob([JSON.stringify(json)], { type: "application/json" }));
    const response = await fetch("https://ipfs.infura.io:5001/api/v0/add?pin=true", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
    const url = `https://ipfs.infura.io/ipfs/${response.Hash}`;
    return url;
  },
};
