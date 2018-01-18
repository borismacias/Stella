const fetch = require('node-fetch')
const JSSHA = require('jssha')
const shaObj = new JSSHA('SHA-512', 'TEXT')
const apiKey = 'DLbjKJxpJswiFovNjPm5dkrgB6yjDpXmn8'
const apiSecret = 'ph3YvXMZzo6uoBCM9PW6ynLCv76Mi2t86e'

async function fullQuery (url, query, apiKey, apiSecretKey) {
  let timeStamp = new Date().getTime() / 1000

  shaObj.setHMACKey(apiSecretKey, 'TEXT')
  let body = JSON.stringify(query)
  shaObj.update(timeStamp + body)
  let signature = shaObj.getHMAC('HEX')

  try {
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ORIONX-TIMESTAMP': timeStamp,
        'X-ORIONX-APIKEY': apiKey,
        'X-ORIONX-SIGNATURE': signature,
        'Content-Length': body.length
      },
      body
    })
    return res.json()
  } catch (e) {
    throw (e)
  }
}

async function main (query) {
  try {
    let res = await fullQuery(
      'https://api.orionx.io/graphql',
      query,
      apiKey,
      apiSecret
    )

    console.log('*** Response ***')
    console.log(res.data)
  } catch (e) {
    console.log(e)
    throw (e)
  }
}

let query = {
  query: `{
    market(code: "CHACLP"){
      lastTrade{
        price
      }
      currentStats
    }
  }
`}

main(query)
