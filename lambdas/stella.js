const fetch = require('node-fetch')

export async function getChauchaValue (_, context) {
  let query = `{
      market(code: "CHACLP"){
        lastTrade{
          price
        }
      }
    }`

  try {
    await fetch('https://api.orionx.io/graphql', {
      method: 'POST',
      body: JSON.stringify({query: query}),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(json => context.succeed(json.data.market.lastTrade.price))
  } catch (e) {
    context.error(`OrionX api timed out. Please try again later.`)
  }
}
