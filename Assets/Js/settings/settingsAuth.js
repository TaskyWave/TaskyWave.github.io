import { databaseIsReady, initDataBase } from './settings.js';

export let auth0 = null;
export let isAuthenticated = null;
export let user = null;
export let userProfile = null;

window.onload = async () => {
    await configureClient()
    await processLoginState()
    updateUI()
    userProfile = await auth0.getUser();
    await initDataBase();
    console.log(databaseIsReady);
    console.log(userProfile)
}

const configureClient = async () => {
  auth0 = await createAuth0Client({
    domain: "dev-k2kmewd5n7y1vv4c.us.auth0.com",
    client_id: "ViENR2c3HWIW5eof4jwpBW2n81DEqRVz",
    cacheLocation: 'localstorage',
    useRefreshTokens: true
  })
}

// check le login du client auth0
const processLoginState = async () => {
  // Check code and state parameters
  try{
    const query = window.location.search
    if (isSafari()) {
      await auth0.handleRedirectCallback()
    } else {
      if (query.includes("code=") && query.includes("state=")) {
        // Process the login state
        // await auth0.handleRedirectCallback()
        await auth0.getTokenSilently();
        // Use replaceState to redirect the user away and remove the querystring parameters
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }
  catch(err){
    console.error("Erreur processLoginState >>> \n " + err);
  }
}

// Fonction pour vérifier si le navigateur est Safari
function isSafari() {
  // Vérifie si l'agent utilisateur contient "Safari"
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

const updateUI = async () => {
  isAuthenticated = await auth0.isAuthenticated()
  // NEW - add logic to show/hide gated content after authentication
  if (isAuthenticated) {
    document.getElementById("btn-logout").style.display = 'block';
    document.getElementById("btn-account").style.display = 'block';

    document.getElementById("accountPicture").src = userProfile.picture;
    document.getElementById("accountNickName").textContent = "compte : " + userProfile.nickname;
  }
  else{
    window.location.href = 'index.html';
    document.getElementById("btn-logout").style.display = 'none';
    document.getElementById("btn-account").style.display = 'none';
  }
}

export const logout = () => {
  auth0.logout({
    returnTo: window.location.href,
  })
}

document.addEventListener('DOMContentLoaded', () => {
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', logout);
    }
});