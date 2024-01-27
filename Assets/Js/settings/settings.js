// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, get, set, child, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { auth0, userProfile, user } from './settingsAuth.js';
import { afficherPopup, popupFermer, fermerPopupFn } from "./settingsPopUp.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export let databaseIsReady = false;

const firebaseConfig = {
  apiKey: "AIzaSyBE5UO0oQ3vJhbfGKYPR8XlBuBQOLjzWu4",
  authDomain: "taskywave-c64a4.firebaseapp.com",
  databaseURL: "https://taskywave-c64a4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "taskywave-c64a4",
  storageBucket: "taskywave-c64a4.appspot.com",
  messagingSenderId: "300679954444",
  appId: "1:300679954444:web:35db07142b81019f5f2e29",
  measurementId: "G-J03YYET9L2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export async function writeData(path, data) {
  set(ref(database, path), {
    value : data
  });
  console.log("OK ! ");
}

export function updateData(path, data) {

  const updates = {
    value: data
  };

  update(ref(database, path), updates)
    .then(() => {
      console.log('Données mises à jour avec succès.');
    })
    .catch((error) => {
      console.error('Erreur lors de la mise à jour des données :', error);
    });
}

export function deleteData(branchPath) {
  const updates = {};

  updates[branchPath] = null;

  update(ref(database), updates)
    .then(() => {
      console.log('Branche supprimée avec succès.');
    })
    .catch((error) => {
      console.error('Erreur lors de la suppression de la branche :', error);
    });
}

export async function readData(path) {
  const dbRef = ref(database);

  try {
    const snapshot = await get(child(dbRef, path));

    if (snapshot.exists()) {
      const data = snapshot.val();
      return data.value;
    } else {
      console.log("ERR : No data available pour : " + path);
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error; // Vous pouvez choisir de gérer l'erreur ici ou de la propager
  }
}

export async function getAgenda(userID) {
  const dbRef = ref(getDatabase(app));

  try {
    const snapshot = await get(child(dbRef, "user/" + userID + "/agenda"));

    if (snapshot.exists()) {
      const data = snapshot.val();
      return data;
    } else {
      console.log("ERR : No data available pour : " + userID);
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error; // Vous pouvez choisir de gérer l'erreur ici ou de la propager
  }
}

export async function getAgendaPublic() {
  const dbRef = ref(database);

  try {
    const snapshot = await get(child(dbRef, "agenda"));

    if (snapshot.exists()) {
      const data = snapshot.val();
      return data;
    } else {
      console.log("ERR : No data available pour : " + userID);
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error; // Vous pouvez choisir de gérer l'erreur ici ou de la propager
  }
}

export async function initDataBase(){
  var user_id = userProfile.sub;
  var user_id_database = await readData("user/" + user_id + "/user_id/");
  console.log(user_id_database + ' =?= ' + user_id);
  if (user_id_database != user_id){
    window.location.href = 'compte.html';
  }
  else{
    console.log("user_id already OK !");
    databaseIsReady = true;

    document.getElementById("leNickName").textContent = userProfile.nickname;
    document.getElementById("laPicture").src = userProfile.picture
    document.getElementById("verifEmailCheck").textContent = userProfile.email_verified;
    document.getElementById("leMail").textContent = userProfile.email;
    document.getElementById("leGroupe").textContent = await readData("user/" + user_id + "/groupe/");
    document.getElementById("idUser").textContent = user_id;
    document.getElementById("laDateInscription").textContent = convertirTempsUnixEnString(new Date(await readData("user/" + user_id + "/user_updated_at/")));
    document.getElementById("leRole").textContent = await readData("user/" + user_id + "/role/");
  }
}

function convertirTempsUnixEnString(tempsUnix) {
  try{
      // Créer une nouvelle instance de Date en utilisant le temps Unix (en millisecondes)
      const date = new Date(tempsUnix);
  
      // Tableaux pour les noms des jours de la semaine et des mois
      const joursSemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
      const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  
      // Obtenir le nom du jour, le numéro du jour, le mois, l'heure et les minutes
      const annee = date.getFullYear();
      const nomDuJour = joursSemaine[date.getDay()];
      const numeroDuJour = date.getDate();
      const moiDuTempsUnix = mois[date.getMonth()];
      const heureTempUnix = date.getHours();
      const minuteTempUnix = date.getMinutes();
  
      // Formater la chaîne résultante
      const resultat = `${nomDuJour} ${numeroDuJour} ${moiDuTempsUnix} ${annee}, à ${heureTempUnix}:${minuteTempUnix < 10 ? '0' : ''}${minuteTempUnix}`;
  
      return resultat;
  }
  catch(err){
      console.error("Erreur convertirTempsUnixEnString >>> \n " + err);
      afficherPopup("Erreur convertirTempsUnixEnString", err.stack);
  }
}