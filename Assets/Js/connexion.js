let auth0 = null
var isAuthenticated = null;
var userProfile = null;

window.onload = async () => {
  await configureClient()
  await processLoginState()
  updateUI()
}

const configureClient = async () => {
  auth0 = await createAuth0Client({
    domain: "dev-k2kmewd5n7y1vv4c.us.auth0.com",
    client_id: "ViENR2c3HWIW5eof4jwpBW2n81DEqRVz",
  })
}

const processLoginState = async () => {
  // Check code and state parameters
  const query = window.location.search
  if (query.includes("code=") && query.includes("state=")) {
    // Process the login state
    await auth0.handleRedirectCallback()
    // Use replaceState to redirect the user away and remove the querystring parameters
    window.history.replaceState({}, document.title, window.location.pathname)
  }
}

const updateUI = async () => {
  isAuthenticated = await auth0.isAuthenticated()
  // NEW - add logic to show/hide gated content after authentication
  if (isAuthenticated) {
    userProfile = await auth0.getUser();
    document.getElementById("btn-logout").style.display = 'block';
    document.getElementById("btn-account").style.display = 'block';
    document.getElementById("btn-login").style.display = 'none';
  }
  else{
    document.getElementById("btn-logout").style.display = 'none';
    document.getElementById("btn-account").style.display = 'none';
    document.getElementById("btn-login").style.display = 'block';
  }
}

const login = async () => {
  // NEW - add logic to show/hide gated content after authentication
  await auth0.loginWithRedirect({
    redirect_uri: window.location.href,
  })
}

const logout = () => {
  auth0.logout({
    returnTo: window.location.href,
  })
}