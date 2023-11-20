var SUPABASE_URL = 'https://yeetqwekspzypbgnjhvs.supabase.co'
var SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZXRxd2Vrc3B6eXBiZ25qaHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxMDA3NTcsImV4cCI6MjAxMTY3Njc1N30.9zzpjAwBdsoHJWQsfrHeenKASCLbtkjgpUjHJ4ggNGs'

// initialisation de la connection de la BDD
var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
window.userToken = null

document.addEventListener('DOMContentLoaded', function (event) {
    // Si bouton Inscription click :
    var resetPSWRDform = document.querySelector('#ChangePSWRD')
    resetPSWRDform.onsubmit = reset.bind(resetPSWRDform)

    const boutonFermerPopup = document.getElementById("fermerPopup");
    const popup = document.getElementById("popup");
    const messagePopup = document.getElementById("messagePopup");
    const titrePopup = document.getElementById("titrePopup");

  // fermeture du popup
  boutonFermerPopup.addEventListener("click", function() {
    popup.style.display = "none";
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

const reset = (event) => {

    // Recuperation des inputs
    event.preventDefault()
    const Newpswrd = event.target[0].value
  
    supabase.auth.api.updateUser({ password: Newpswrd }).then((response) => {
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