import { writeData, initDataBase } from './settings.js';
import { auth0, userProfile, user } from './settingsAuth.js';

export var popupFermer = true;

var popup = document.getElementById('popup');
var fermerPopup = document.getElementById('fermerPopup');
var titrePopup = document.getElementById('titrePopup');
var messagePopup = document.getElementById('messagePopup');

var overlay = document.getElementById('overlay');

document.addEventListener('DOMContentLoaded', function () {
    // Récupérez les éléments du DOM
    popup = document.getElementById('popup');
    fermerPopup = document.getElementById('fermerPopup');
    titrePopup = document.getElementById('titrePopup');
    messagePopup = document.getElementById('messagePopup');

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
    overlay.style.display = 'block';
}

// Fonction pour masquer le popup
export function fermerPopupFn() {
    popup.style.display = 'none';
    popupFermer = true;
    overlay.style.display = 'none';
}