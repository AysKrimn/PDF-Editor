// this file will be used to fetch data from the server / apis
async function getData(url: string): Promise<Response> {
  return fetch(url).then((res) => res.json());
}

async function postData(url: string, payload: any): Promise<Response> {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

export const fetchService = {
  get: getData,
  post: postData,
};
