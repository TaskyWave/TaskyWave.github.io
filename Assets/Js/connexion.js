
// var global
let auth0 = null
var isAuthenticated = null;
var userProfile = null;

// quand le site est load
window.onload = async () => {
  // update du client, et de l'ui de la page index.html
  await configureClient()
  await processLoginState()
  updateUI()
}

// configuration du client auth0
const configureClient = async () => {
  try{
    auth0 = await createAuth0Client({
      domain: "dev-k2kmewd5n7y1vv4c.us.auth0.com",
      client_id: "ViENR2c3HWIW5eof4jwpBW2n81DEqRVz",
      cacheLocation: 'localstorage',
      useRefreshTokens: true
    })
  }
  catch(err){
    console.error("Erreur configureClient >>> \n " + err);
  }
}

// check le login du client auth0
const processLoginState = async () => {
  // Check code and state parameters
  try{
    const query = window.location.search
    if (query.includes("code=") && query.includes("state=")) {
      // Process the login state
      await auth0.handleRedirectCallback()
      // Use replaceState to redirect the user away and remove the querystring parameters
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }
  catch(err){
    console.error("Erreur processLoginState >>> \n " + err);
  }
}

// update de la page index.html
const updateUI = async () => {
  try{
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
  catch(err){
    console.error("Erreur updateUI >>> \n " + err);
  }
}

// fonction de login du client auth0 via auth0 avec redirect
const login = async () => {
  try{
    // NEW - add logic to show/hide gated content after authentication
    await auth0.loginWithRedirect({
      redirect_uri: window.location.href,
    })
  }
  catch(err){
    console.error("Erreur login >>> \n " + err);
  }
}

// fonction de deconnexion du client auth0
const logout = () => {
  try{
    auth0.logout({
      returnTo: window.location.href,
    })
  }
  catch(err){
    console.error("Erreur logout >>> \n " + err);
  }
}