# Upload

## Each script in the `./upload` directory _must_ have two methods

1. uploadFile(file) - Will upload a file and return a url
2. uploadJson(json) - Will upload a json file and return a url

## Example: Upload json on IPFS

`ipfs.uploadJson({hello: "there"})`

Will upload the json and return a url

https://bafybeif7mo2igxawsicmmtnx2zvwd6tmz6enwzj3xzkrxzpa7mdupngs5q.ipfs.infura-ipfs.io/

## Resources

https://docs.infura.io/infura/networks/ipfs/http-api-methods/add

https://www.youtube.com/watch?v=e13T3O0Iyvc
