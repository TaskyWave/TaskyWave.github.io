import { databaseIsReady, initDataBase } from './compte.js';
import { loadAgenda, loadAgendaPublic } from './agenda.js';
import { setupEDT } from './edt.js';

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
  loadAgenda();
  loadAgendaPublic();
  setupEDT();
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
    document.getElementById("btn-logout").style.display = 'block';
    document.getElementById("btn-account").style.display = 'block';
  }
  else{
    window.location.href = 'index.html';
    document.getElementById("btn-logout").style.display = 'none';
    document.getElementById("btn-account").style.display = 'none';
  }
}

export const login = async () => {
  // NEW - add logic to show/hide gated content after authentication
  await auth0.loginWithRedirect({
    redirect_uri: window.location.href,
  })
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