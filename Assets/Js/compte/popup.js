import { writeData, initDataBase } from './compte.js';
import { auth0, userProfile, user } from './auth.js';

export var popupFermer = true;

var popup = document.getElementById('popup');
var fermerPopup = document.getElementById('fermerPopup');
var titrePopup = document.getElementById('titrePopup');
var messagePopup = document.getElementById('messagePopup');

var popupInscription = document.getElementById('popup-insc');
var fermerPopupInscription = document.getElementById('fermerPopup-insc');

document.addEventListener('DOMContentLoaded', function () {
    // Récupérez les éléments du DOM
    popup = document.getElementById('popup');
    fermerPopup = document.getElementById('fermerPopup');
    titrePopup = document.getElementById('titrePopup');
    messagePopup = document.getElementById('messagePopup');

    popupInscription = document.getElementById('popup-insc');

    // Fonction pour afficher le popup avec un titre et un message

    // Événement pour fermer le popup lorsqu'on clique sur le bouton de fermeture
    fermerPopup.addEventListener('click', fermerPopupFn);

    // Autres exemples d'utilisation :
    // - Afficher le popup en réponse à un événement (clic sur un bouton, etc.)
    // - Charger le contenu du popup dynamiquement depuis une source externe
});

export function afficherPopup(titre, message) {
    popupFermer = false;
    titrePopup.textContent = titre;
    messagePopup.textContent = message;
    popup.style.display = 'block';
}

export function afficherPopupInscription(){
    popupFermer = false;
    popupInscription.style.display = 'block';
}

export async function fermerPopupFnInscription() {
    event.preventDefault();

    // Obtenir la date actuelle
    const currentDate = new Date();

    // Réinitialiser l'heure à 00:00:00
    currentDate.setHours(0, 0, 0, 0);

    // Obtenir la date de demain
    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 1);

    // Convertir les dates en timestamps
    var dateDebut = currentDate.getTime();
    var dateFin = tomorrowDate.getTime();

    var groupeChoisi = document.getElementById('groupeChoisi').value;
    popupInscription.style.display = 'none';
    popupFermer = true;
    var user_id = userProfile.sub;
    writeData("user/" + user_id + "/user_id/", user_id);
    writeData("user/" + user_id + "/user_email/", userProfile.email);
    writeData("user/" + user_id + "/user_email_verified/", userProfile.email_verified);
    writeData("user/" + user_id + "/user_name/", userProfile.name);
    writeData("user/" + user_id + "/user_nickname/", userProfile.nickname);
    writeData("user/" + user_id + "/user_updated_at/", userProfile.updated_at);
    writeData("user/" + user_id + "/groupe/", groupeChoisi);
    writeData("user/" + user_id + "/role/", "user");
    writeData("user/" + user_id + "/EDT/dateFin", dateFin);
    writeData("user/" + user_id + "/EDT/dateDebut", dateDebut);
    writeData("user/" + user_id + "/agenda/" + "defaultTask" + "/isDo", "false");
    writeData("user/" + user_id + "/agenda/" + "defaultTask" + "/isPublic", "false");
    writeData("user/" + user_id + "/agenda/" + "defaultTask" + "/toDo", "descri");
    writeData("user/" + user_id + "/agenda/" + "defaultTask" + "/dateLimite", "123");
    writeData("user/" + user_id + "/agenda/" + "defaultTask" + "/titre", "defaultTask");
    console.log("user_id registered = OK !");
    location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    const setupGroup_btn = document.getElementById('setupGroup-btn');
    if (setupGroup_btn) {
        setupGroup_btn.addEventListener('click', fermerPopupFnInscription);
    }
});

// Fonction pour masquer le popup
export function fermerPopupFn() {
    popup.style.display = 'none';
    popupFermer = true;
}