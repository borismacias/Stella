const fetch = require('node-fetch')
// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
  try {
    if (event.session.application.applicationId !== 'amzn1.ask.skill.60596b34-7971-41f7-aaf7-53327e89562e') {
      context.fail('Invalid Application ID')
    }

    if (event.session.new) {
      onSessionStarted({ requestId: event.request.requestId }, event.session)
    }

    if (event.request.type === 'LaunchRequest') {
      onLaunch(event.request,
                   event.session,
                   function callback (sessionAttributes, speechletResponse) {
                     context.succeed(buildResponse(sessionAttributes, speechletResponse))
                   })
    } else if (event.request.type === 'IntentRequest') {
      onIntent(event.request,
                   event.session,
                   function callback (sessionAttributes, speechletResponse) {
                     context.succeed(buildResponse(sessionAttributes, speechletResponse))
                   })
    } else if (event.request.type === 'SessionEndedRequest') {
      onSessionEnded(event.request, event.session)
      context.succeed()
    }
  } catch (e) {
    context.fail('Exception: ' + e)
  }
}

function onSessionStarted (sessionStartedRequest, session) {
  console.log('onSessionStarted requestId=' + sessionStartedRequest.requestId +
              ', sessionId=' + session.sessionId)
}

function onLaunch (launchRequest, session, callback) {
  console.log('onLaunch requestId=' + launchRequest.requestId +
              ', sessionId=' + session.sessionId)

  getWelcomeResponse(callback)
}

function onIntent (intentRequest, session, callback) {
  const intent = intentRequest.intent
  const intentName = intent.name
  console.log('ON INTENT: ', intentName)
  if (intentName === 'ChauchaGetValueIntent') {
    getChauchaValue(callback)
  } else {
    throw 'Invalid intent'
  }
}

/**
* Called when the user ends the session.
* Is not called when the skill returns shouldEndSession=true.
*/

function onSessionEnded (sessionEndedRequest, session) {
  console.log('onSessionEnded requestId=' + sessionEndedRequest.requestId +
              ', sessionId=' + session.sessionId)
  // Add cleanup logic here
}

function getChauchaValue (callback) {
  console.log('GETTING CHAUCHA VALUE')
  let query = `{
    market(code: "CHACLP"){
      lastTrade{
        price
      }
    }
  }`

  try {
    fetch('https://api.orionx.io/graphql', {
      method: 'POST',
      body: JSON.stringify({query: query}),
      headers: { 'Content-Type': 'application/json' }
    })
  .then(res => res.json())
  .then(json => onSuccess(callback, json.data.market.lastTrade.price))
  } catch (e) {
    onError(callback)
  }
}

function onSuccess (callback, chauchaValue) {
  const sessionAttributes = {}
  const cardTitle = 'Chaucha Value'
  const speechOutput = 'The chaucha value as of now is ' + chauchaValue + ' CLP'
  const repromptText = null
  const shouldEndSession = true
  console.log('SUCCESS: ', speechOutput)
  callback(sessionAttributes,
               buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession))
}

function onError (callback) {
  const cardTitle = 'Error'
  const speechOutput = "OrionX API's timed out. Try again later."
  const repromptText = null
  const shouldEndSession = true
  callback({}, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession))
}

function getWelcomeResponse (callback) {
  var sessionAttributes = {}
  var repromptText = null

  var cardTitle = 'Welcome!'

  var speechOutput = 'Hi my name is Stella'
  var shouldEndSession = true

  callback(sessionAttributes,
               buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession))
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse (title, output, repromptText, shouldEndSession) {
  return {
    outputSpeech: {
      type: 'PlainText',
      text: output
    },
    card: {
      type: 'Simple',
          // title: "SessionSpeechlet - " + title,
          // content: "SessionSpeechlet - " + output
      title: title,
      content: output
    },
    reprompt: {
      outputSpeech: {
        type: 'PlainText',
        text: repromptText
      }
    },
    shouldEndSession: shouldEndSession
  }
}

function buildResponse (sessionAttributes, speechletResponse) {
  return {
    version: '1.0',
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }
}
