// importation des founction et variables des autres scripts
import { auth0, userProfile, user } from './auth.js';
import { writeData, readData, deleteData } from './compte.js';

// mise en place des liens des EDTs des différants groupes
const LienEdt_INFO_1_D2 = "https://planningsup.app/api/v1/calendars?p=iutdevannes.butdutinfo.1ereannee.gr1d.gr1d2";
const LienEdt_INFO_1_D1 = "https://planningsup.app/api/v1/calendars?p=iutdevannes.butdutinfo.1ereannee.gr1d.gr1d1";

// Obtenir la date actuelle
var currentDate = new Date();
// Réinitialiser l'heure à 00:00:00
currentDate.setHours(0, 0, 0, 0);
// Obtenir la date de demain
var tomorrowDate = new Date(currentDate);
tomorrowDate.setDate(currentDate.getDate() + 1);

// Convertir les dates en timestamps
var dateDebut = currentDate.getTime();
var dateFin = tomorrowDate.getTime();

// definition des variables
var jsonUrl = null;
var groupe = null;

const listeEvenementsDiv = document.getElementById('listeEvenements');
const datePicker = document.getElementById('datePicker');

async function loadEDTTime(){
    var user_id = userProfile.sub;
    dateFin = await readData("user/" + user_id + "/EDT/dateFin", dateFin);
    dateDebut = await readData("user/" + user_id + "/EDT/dateDebut", dateDebut);
}

export async function saveEDTTime(){
    var user_id = userProfile.sub;
    deleteData("user/" + user_id + "/EDT");
    writeData("user/" + user_id + "/EDT/dateFin", dateFin);
    writeData("user/" + user_id + "/EDT/dateDebut", dateDebut);
}

export async function setupEDT(){
    var user_id = userProfile.sub;
    await readData("user/" + user_id + "/groupe/").then(resultat => groupe = resultat);
    if(groupe == "D2"){
        jsonUrl = LienEdt_INFO_1_D2;
    }
    else if(groupe == "D1"){
        jsonUrl = LienEdt_INFO_1_D1;
    }
    else{
        jsonUrl = LienEdt_INFO_1_D1;
    }

    await loadEDTTime().then();
    currentDate = new Date(dateDebut);
    currentDate.setHours(0, 0, 0, 0);
    tomorrowDate.setDate(currentDate.getDate() + 1);
    
    const listeEvenementsDiv = document.getElementById('listeEvenements');
    
    // Remplacez 'URL_DU_JSON' par l'URL réelle de votre fichier JSON
    fetch(jsonUrl)
            .then(response => response.json())
            .then(jsonData => {
                // Combine tous les événements de tous les plannings en une seule liste
                const tousLesEvenements = [].concat(...jsonData.plannings.map(planning => planning.events));
    
                // Triez les événements par horaire
                tousLesEvenements.sort((a, b) => a.start - b.start);
    
                // Filtrer les événements entre dateDebut et dateFin
                const evenementsFiltres = tousLesEvenements.filter(event => event.start >= dateDebut && event.end <= dateFin);

                const buttonsContainer = document.createElement("div");
                const addDayButton = document.createElement("button");
                const subtractDayButton = document.createElement("button");
                const returnToTodayButton = document.createElement("button");

                subtractDayButton.textContent = "<";
                addDayButton.textContent = ">";
                returnToTodayButton.textContent = "Aujourd'hui";

                listeEvenementsDiv.appendChild(buttonsContainer);
                buttonsContainer.classList.add('change-edt-btn');
                buttonsContainer.appendChild(subtractDayButton);
                buttonsContainer.appendChild(returnToTodayButton);
                buttonsContainer.appendChild(addDayButton);

                addDayButton.addEventListener("click", async function () {
                    currentDate.setDate(currentDate.getDate() + 1);
                    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
                
                    // Mettez à jour les timestamps
                    dateDebut = currentDate.getTime();
                    dateFin = tomorrowDate.getTime();
                
                    await saveEDTTime();

                    // Utilisez les dates mises à jour comme nécessaire
                    console.log("Nouvelle date de début :", dateDebut);
                    console.log("Nouvelle date de fin :", dateFin);
                    window.location.reload();
                });

                returnToTodayButton.addEventListener("click", async function () {
                    currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);

                    tomorrowDate = new Date(currentDate);
                    tomorrowDate.setDate(currentDate.getDate() + 1);
                
                    // Mettez à jour les timestamps
                    dateDebut = currentDate.getTime();
                    dateFin = tomorrowDate.getTime();
                
                    await saveEDTTime();

                    // Utilisez les dates mises à jour comme nécessaire
                    console.log("Nouvelle date de début :", dateDebut);
                    console.log("Nouvelle date de fin :", dateFin);
                    window.location.reload();
                });

                // Ajouter un gestionnaire d'événements pour enlever un jour aux dates
                subtractDayButton.addEventListener("click", async function () {
                    currentDate.setDate(currentDate.getDate() - 1);
                    tomorrowDate.setDate(tomorrowDate.getDate() - 1);

                    // Mettez à jour les timestamps
                    dateDebut = currentDate.getTime();
                    dateFin = tomorrowDate.getTime();

                    await saveEDTTime();

                    // Utilisez les dates mises à jour comme nécessaire
                    console.log("Nouvelle date de début :", dateDebut);
                    console.log("Nouvelle date de fin :", dateFin);
                    window.location.reload();
                });

                const titreMainElement = document.getElementById("edt_titre_main");

                const aujourdHui = new Date();
                const demain = new Date();
                demain.setDate(demain.getDate() + 1);
                if (currentDate.toDateString() === aujourdHui.toDateString()) {
                    titreMainElement.textContent = "Aujourd'hui";
                } else if (currentDate.toDateString() === demain.toDateString()) {
                    titreMainElement.textContent = "Demain";
                } else {
                    // Si ce n'est ni aujourd'hui ni demain, utilisez la date de début
                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    titreMainElement.textContent = currentDate.toLocaleDateString('fr-FR', options);
                }
    
                // Afficher les événements triés et filtrés
                evenementsFiltres.forEach((event, index, array) => {
                    // Créez un élément HTML (une case) pour chaque événement
                    const eventElement = document.createElement('div');
                    eventElement.classList.add('event-box');
                    eventElement.innerHTML = `
                        <strong>${event.name}</strong><br>
                        ${event.location}<br>
                        ${event.description}<br>
                        ${formatTime(event.start)} - ${formatTime(event.end)}
                    `;
                    
                    // Exemple d'utilisation
                    let eventColor = event.color || "#77bbff";
                    let color = intensifyColor(eventColor, -2.5);
                    
                    eventElement.style.backgroundColor = color;
    
                    listeEvenementsDiv.appendChild(eventElement);
    
                    // Ajoutez un élément de temps entre les événements (sauf pour le dernier événement)
                    if (index < array.length - 1) {
                        const timeGapElement = document.createElement('div');
                        timeGapElement.classList.add('time-gap');
                        timeGapElement.innerHTML = `Pause : ${calculateTimeGap(event.end, array[index + 1].start)}`;
                        
                        const timeGap = index < array.length - 1 ? array[index + 1].start - event.end : 0;
    
                        timeGapElement.style.height = `${timeGap / (1000 * 60) + 30}px`;
                        // Ajoutez l'élément de temps après l'événement actuel et avant l'événement suivant
                        listeEvenementsDiv.appendChild(timeGapElement);
                    }
                });
            })
            .catch(error => console.error('Erreur lors du chargement du JSON :', error));
}

function intensifyColor(hexColor, factor) {
    // Convertir la couleur hexadécimale en valeurs RVB
    let r = parseInt(hexColor.substr(1, 2), 16);
    let g = parseInt(hexColor.substr(3, 2), 16);
    let b = parseInt(hexColor.substr(5, 2), 16);

    // Augmenter l'intensité de la couleur en ajoutant au lieu de multiplier
    r = Math.min(r + Math.floor((255 - r) * factor), 255);
    g = Math.min(g + Math.floor((255 - g) * factor), 255);
    b = Math.min(b + Math.floor((255 - b) * factor), 255);

    // Convertir les valeurs RVB en couleur hexadécimale
    let resultColor = `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()}`;

    return resultColor;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}h${minutes}`;
}

function calculateTimeGap(endTime, nextStartTime) {
    const timeGap = nextStartTime - endTime;
    const hours = Math.floor(timeGap / (1000 * 60 * 60));
    const minutes = Math.floor((timeGap % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0 && minutes > 0) {
        return `${minutes}min`;
    } else if (hours > 0 && minutes === 0) {
        return `${hours}h`;
    } else if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}min`;
    } else {
        return "";
    }
}

datePicker.addEventListener('change', async function (){
    const selectedDate = new Date(datePicker.value);

    currentDate.setDate(selectedDate.getDate());
    tomorrowDate.setDate(selectedDate.getDate() + 1);

    // Mettez à jour les timestamps
    dateDebut = currentDate.getTime();
    dateFin = tomorrowDate.getTime();

    await saveEDTTime();

    // Utilisez les dates mises à jour comme nécessaire
    console.log("Nouvelle date de début :", dateDebut);
    console.log("Nouvelle date de fin :", dateFin);
    window.location.reload();
});