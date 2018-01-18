function getOrionChauchaValue (response) {
  var https = require('https')
  var url = 'https://api.orionx.io/graphql'

  var postData = `query{
        market(code: "CHACLP"){
         lastTrade{
           price
         }
        }
      }`

  const payload = {
    'query': `{
          market(code: "CHACLP"){
            lastTrade{
              price
            }
           }
        }`
  }

  var postOptions = {
    host: 'api.orionx.io',
    port: '443',
    path: '/graphql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  }

  return window.fetch(url, {
    method: 'POST',
    'Content-Type': 'application/json',
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Here is the data: ', data)
  })

  // var postRequest = https.request(postOptions, function (res) {
  //   var body = ''

  //   res.on('data', function (chunk) {
  //     body += chunk
  //     console.log('CHUNK: ', chunk)
  //   })

  //   res.on('end', function () {
  //     response(body)
  //   })

  //   res.on('error', function (e) {
  //     console.log('error:' + e.message)
  //     context.fail('error:' + e.message)
  //   })
  // })

  // postRequest.write(JSON.stringify(payload))
  // console.log(postRequest)
  // postRequest.end()

  // http.get(options, function (res) {
    //  console.log("Response: " + res.statusCode);
  //    response(res.statusCode);
  // }).on('error', function (e) {
  //    console.log("Error message: " + e.message);
  // });
}

getOrionChauchaValue(function (res) { console.log('result: ', res.status) })
