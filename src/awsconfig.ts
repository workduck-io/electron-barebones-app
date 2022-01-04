const config = {
  clientId: '2ihj64grcq87pe3svecr5hafk2',
  userPoolUri: 'workduck.auth.us-east-1.amazoncognito.com',
  userPool: 'us-east-1_Zu7FAh7hj',
  region: 'us-east-1',
  callbackUri: 'http://localhost:3000/',
  signoutUri: 'http://localhost:3000/',
  tokenScopes: ['openid', 'email', 'profile', 'aws.cognito.signin.user.admin']
}

export default config
