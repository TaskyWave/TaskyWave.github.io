/** Gestion d'authentification
 * 
 * Auteur : C.D
 * Version : 1.0.0
 * 
 * Script :
 * -> Redirection de l'utilisateur si déjà connecter
 * -> Inscription d'un utilisateur
 * -> Connection d'un utilisateur
 * 
 */

// URL et APIKEY de la BDD
var SUPABASE_URL = 'https://yeetqwekspzypbgnjhvs.supabase.co'
var SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZXRxd2Vrc3B6eXBiZ25qaHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxMDA3NTcsImV4cCI6MjAxMTY3Njc1N30.9zzpjAwBdsoHJWQsfrHeenKASCLbtkjgpUjHJ4ggNGs'

// Initialisation de la connection à la BDD
var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
window.userToken = null

// Si l'utilisateur est déjà connecter
if (JSON.stringify(supabase.auth.user()) != 'null') {
  // Redirection vers le compte utilisateur
  window.location.href = "compte.html";
}

// Listener d'event
document.addEventListener('DOMContentLoaded', function (event) {
  // Si bouton Inscription click :
  var signUpForm = document.querySelector('#sign-up')
  signUpForm.onsubmit = signUpSubmitted.bind(signUpForm)

  // Si bouton Connection click :
  var logInForm = document.querySelector('#log-in')
  logInForm.onsubmit = logInSubmitted.bind(logInForm)

  // Recuperation des éléments pour le popup
  const boutonFermerPopup = document.getElementById("fermerPopup");
  const popup = document.getElementById("popup");
  const messagePopup = document.getElementById("messagePopup");
  const titrePopup = document.getElementById("titrePopup");

  // fermeture du popup
  boutonFermerPopup.addEventListener("click", function() {
    popup.style.display = "none";
    location.reload();
  });

  // fermeture du popup
  window.addEventListener("click", function(event) {
    if (event.target == popup) {
      popup.style.display = "none";
    }
  });

})

// fonction pour ouvrir un popup
function boutonOuvrirPopup(){
  popup.style.display = "block";
}

// Fonction de création d'un utilisateur
const signUpSubmitted = (event) => {

  // Recuperation des inputs
  event.preventDefault()
  const email = event.target[0].value
  const password = event.target[1].value

  // Fonction native de supabase pour créer un utilisateur.
  // si OK : email sent
  // sinon : ERR : affiche l'err
  supabase.auth.signUp({ email, password }).then((response) => {
      // si erreur :
      if(response.error){
        // affiche l'erreur dans le popup
        messagePopup.innerText  = response.error.message
        titrePopup.innerText = 'Erreur !'
        boutonOuvrirPopup()
      }
      // sinon, continue l'inscription
      else{
        setToken(response)
      }
    }).catch((err) => {
      // afiche si autre erreur
      messagePopup.innerText  = err
      titrePopup.innerText = 'Erreur ! (contact C.D)'
      boutonOuvrirPopup()
    })
}

// Fonction de login d'un utilisateur
const logInSubmitted = (event) => {

  // Recuperation des Inputs
  event.preventDefault()
  const email = event.target[0].value
  const password = event.target[1].value

  // Fonction native de supabase pour créer un utilisateur.
  // si OK : Reload la page
  // sinon : ERR : Reload la page
  supabase.auth.signIn({ email, password }).then((response) => {
      // si erreur
      if(response.error){
        // affiche l'erreur dans un popup
        messagePopup.innerText  = response.error.message
        titrePopup.innerText = 'Erreur !'
        boutonOuvrirPopup()
      }
      else{
        // sinon, continue la connection
        setToken(response)
      } 
    }).catch((err) => {
      // si autre erreur, dans un popup
      messagePopup.innerText  = err.response.text
      titrePopup.innerText = 'Erreur ! (contact C.D)'
      boutonOuvrirPopup()
    })
}

// Fonction d'affichage 
function setToken(response) {
  // si Inscription réussie
  if (response.user.confirmation_sent_at && !response?.session?.access_token) {
    // affiche info en plus
    messagePopup.innerText  = 'Confirmation Email Sent'
    titrePopup.innerText = 'Inscription en cours !'
    boutonOuvrirPopup()
  } else {
    //sinon, connection reussi
    // affiche info en plus
    messagePopup.innerText  = 'Connecté sur le compte : ' + response.user.email + " !"
    titrePopup.innerText = 'Connecté !'
    boutonOuvrirPopup()
  }
}