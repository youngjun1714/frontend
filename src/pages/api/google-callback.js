const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      // TODO error or index
      res.redirect('/404');
    }
    res.setHeader(
      'Set-Cookie',
      `google-oauth-code=${code}; Path=/; Max-Age=60; HttpOnly`
    );

    res.redirect('/adf-signup/google-callback');
  } catch (e) {
    console.error(e);
    res.redirect('/500');
  }
};

export default googleCallback;
