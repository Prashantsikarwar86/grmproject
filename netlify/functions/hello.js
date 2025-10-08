exports.handler = async function(event, context) {
  // example: access an environment variable
  const appName = process.env.APP_NAME || 'GRM Project'
  const secretNote = process.env.MY_SECRET ? 'set' : 'not-set'

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello from ${appName}`,
      secret: secretNote,
      now: new Date().toISOString()
    })
  }
}
