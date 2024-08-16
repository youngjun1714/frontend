import oauth2Client from '@/utils/googleOauth2Client';

const scopes = ['email', 'profile', 'openid'];

const googleAuth = (req, res) => {
  const authorizedUrl = oauth2Client.generateAuthUrl({
    access_type: 'online',
    scope: scopes,
    prompt: 'consent',
    // state: 'random-string',
  });

  // res.setHeader('Set-Cookie', 'ABNC=DEF;');
  res.redirect(authorizedUrl);
};

export default googleAuth;
