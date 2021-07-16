import { SiteClient } from "datocms-client"

export default async function receiveRequest(request, response) {

  if (request.method === "POST") {

  const TOKEN = "0f98901596f928aba91aa7a6660ade"

  const client = new SiteClient(TOKEN);
  
  const recordCreated = await client.items.create({
    itemType: "968675",
    ...request.body,
    // title: "",
    // imageUrl: "",
    // creatorSlug: "",
  })
  
  response.json({
    dados: "Um dado qualquer",
    recordCreated: recordCreated,
  })
  }
}