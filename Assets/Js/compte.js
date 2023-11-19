/** Gestion d'authentification
 * 
 * Auteur : C.D
 * Version : 1.0.0
 * 
 * Script :
 * -> Demande si besoin des info en plus
 * -> GUI propre à l'utilisateur
 * 
 */

// URL et APIKEY de la BDD
var SUPABASE_URL = 'https://yeetqwekspzypbgnjhvs.supabase.co'
var SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZXRxd2Vrc3B6eXBiZ25qaHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxMDA3NTcsImV4cCI6MjAxMTY3Njc1N30.9zzpjAwBdsoHJWQsfrHeenKASCLbtkjgpUjHJ4ggNGs'

// initialisation de la connection de la BDD
var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
window.userToken = null
var registerForm = null
var nomEtGrp = null
var titrePage = null

// lien entre les bouttons, inputs et les fonctions.
document.addEventListener('DOMContentLoaded', function (event) {

  // Recuperation des éléments HTML
  registerForm = document.getElementById("register");
  nomEtGrp = document.getElementById("nomGrp");
  titrePage = document.getElementById("titrePage");

  var regForm = document.querySelector('#register')
  regForm.onsubmit = registerUser.bind(regForm)

  var logoutButton = document.querySelector('#logout-button')
  logoutButton.onclick = logoutSubmitted.bind(logoutButton)

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

function boutonOuvrirPopup(){
  popup.style.display = "block";
}

// Si l'utilisateur n'est pas connecter
if (JSON.stringify(supabase.auth.user()) == 'null') {
  // redirige vers la connection
    window.location.href = "connexion.html";
}

// au Start, Initialise le GUI propre à l'user
async function checkAccount(){
  // on lit les données utilisateur
  jsonString = JSON.stringify(supabase.auth.user())
  console.log(jsonString)

  // on récup l'ID unique
  var jsonData = JSON.parse(jsonString);
  console.log(jsonData.id)
  console.log(jsonData.email)

  // on recup les données du compte utilisateur
  let { data: Compte, error } = await supabase.from('Compte').select('*').eq('ID', jsonData.id)

  console.log(JSON.stringify(Compte))
  console.log(error)

  // extraction des données utile
  var nom = Compte.map(function(item) {
    return item.Nom;
  });
  
  var groupe = Compte.map(function(item) {
    return item.Groupe;
  });

  // Si pas d'erreur
  if(error == null){
    console.log("OK !")
  }
  //si pas d'info du compte
  if (JSON.stringify(Compte) == '[]'){
    // on affiche les inputs
    registerForm.style.display = "block";
    titrePage.innerText = "Finalisation du compte :";
  }
  // sinon
  else{
    // on affiche les infos du compte
    registerForm.style.display = "none";
    nomEtGrp.innerText = "Bonjours, " + nom + " (groupe : " + groupe +") !";
  }
}

// Fonction pour enrengistrer les données utilisateur
const registerUser = async (event) => {
  event.preventDefault()
  const nom = event.target[0].value
  const Grp = event.target[1].value

  // on lit les données utilisateur
  jsonString = JSON.stringify(supabase.auth.user())

  // on récup l'ID unique
  var jsonData = JSON.parse(jsonString);

  // insertion des données utilisateurs
  const { data, error } = await supabase.from('Compte').insert({ ID: jsonData.id, Nom: nom, Groupe: Grp, Email: jsonData.email, DateInscription: jsonData.email_confirmed_at})

  // si erreur
  if (error != null){
    // popup qui affiche l'erreur
    messagePopup.innerText  = error
    titrePopup.innerText = 'Erreur !'
    boutonOuvrirPopup()
  }

  // sinon
  else{
    // popup qui valide l'inscription
    messagePopup.innerText  = "Le compte à bien été créer"
    titrePopup.innerText = 'Tout est bon !'
    boutonOuvrirPopup()
  }
}

// load des données
async function loadData() {
  
  // récup data et erreur
  // from (la table) select (la colone)
let { data: Compte, error } = await supabase.from('Compte').select('Utilisateur')

  console.log(JSON.stringify(Compte))
  console.log(error)
}

// insert des données
async function insertData() {

  // from (table) insert ({clé:valeur, clé:valeur})
  const { data, error } = await supabase.from('Compte').insert({ Utilisateur: 'John'})

  console.log(data)
  console.log(error)
}

// update un tuple:
async function UpdateData() {

  // from (table) update ({clé:new_Valeur}) condition(clé,valeur)
  const { data, error } = await supabase.from('Compte').update({ Test: 'testest' }).eq('Utilisateur','John')

  console.log(data)
  console.log(error)
}

// logout un user
const logoutSubmitted = (event) => {
  event.preventDefault()

  supabase.auth.signOut().then((_response) => {
      alert('Logout successful')
    }).catch((err) => {
      alert(err.response.text)
    })
    location.reload();
}

checkAccount();