import { getAgenda, databaseIsReady, readData, writeData, updateData, deleteData, getAgendaPublic } from './compte.js';
import { userProfile } from './auth.js';

let agendaData = null;
let agendaDataPublic = null;
var role = null;
let groupe = null;
var nowTimestamp = Math.floor(Date.now() / 1000);

// Exemple d'utilisation avec un temps Unix (par exemple, le temps actuel)
const tempsUnixActuel = Math.floor(Date.now() / 1000);
const resultatFormate = convertirTempsUnixEnString(tempsUnixActuel);
console.log(resultatFormate);

export async function loadAgenda(){
    var user_id = userProfile.sub;

    await readData("user/" + user_id + "/role/").then(resultat => role = resultat);
    console.log(role);
    var sectionElement = document.getElementById("section-agenda-addevent-public");
    if(role == "user"){
        // Vérifier si l'élément existe avant de le supprimer
        if (sectionElement) {
            // Supprimer l'élément
            sectionElement.parentNode.removeChild(sectionElement);
            console.log("removed !");
        } else {
            console.error("L'élément section-agenda-addevent-public n'existe pas.");
        }
    }
    else{
        sectionElement.style.display = 'block';
    }

    if(databaseIsReady){
      getAgenda(user_id)
        .then((resultat) => {
          // Transformation de l'objet en chaîne JSON

          agendaData = JSON.stringify(resultat);
          setupAgenda();
        })
        /*.catch((erreur) => {
          console.error('Une erreur s\'est produite :', erreur);
        });*/
    }
    else{
      console.error("databaseIsReady est à false");
    }
}

export async function loadAgendaPublic(){
    var user_id = userProfile.sub;

    if(databaseIsReady){
      getAgendaPublic(user_id)
        .then((resultat) => {
            // Transformation de l'objet en chaîne JSON
            agendaDataPublic = JSON.stringify(resultat);
            var tasks = JSON.parse(agendaDataPublic);
            var taskArray = [];
            for (var taskKey in tasks) {
                if (tasks.hasOwnProperty(taskKey)) {
                    taskArray.push(tasks[taskKey]);
                }
            }

            try{
                taskArray.sort(function (a, b) {
                    var dateA = new Date(a.dateLimite.value);
                    var dateB = new Date(b.dateLimite.value);
            
                    return dateA - dateB;
                });
            }
            catch{

            }

            for (var i = 0; i < taskArray.length; i++) {
                (function () {
                    var task = taskArray[i];

                    // Ne pas prendre la tâche "defaultTask"
                    if (task.titre.value === 'defaultTask') {
                        
                    }
                    else{
                        var titre = task.titre.value;
                        var isDo = task.isDo.value;
                        var dateLimite = task.dateLimite.value;
                        var isPublic = task.isPublic.value;
                        var toDo = task.toDo.value;
                        var groupe = task.groupe.value;

                        var user_id = userProfile.sub;
                        readData("user/" + user_id + "/agenda/" + titre + "/titre").then((resultat) => {
                            if(resultat != titre){
                                writeData("user/" + user_id + "/agenda/" + titre + "/isDo", false);
                                writeData("user/" + user_id + "/agenda/" + titre + "/isPublic", "true");
                                writeData("user/" + user_id + "/agenda/" + titre + "/toDo", toDo);
                                writeData("user/" + user_id + "/agenda/" + titre + "/titre", titre);
                                writeData("user/" + user_id + "/agenda/" + titre + "/groupe", groupe);
                                writeData("user/" + user_id + "/agenda/" + titre + "/dateLimite", dateLimite);
                            }
                        });
                    }
                })();
            }
            loadAgenda();
        })
    }
    else{
      console.error("databaseIsReady est à false");
    }
}

export async function saveNewTask(){
    event.preventDefault();

    var titre = document.getElementById('titre').value;
    var description = document.getElementById('description').value;
    var dateLimite = document.getElementById('dateLimite').value;
    var horaireLimite = document.getElementById('horaireLimite').value;

    if (titre === "" || description === "" || dateLimite === "" || horaireLimite === "") {
        alert("Veuillez remplir tous les champs");
        console.error("Veuillez remplir tous les champs");
    }
    else if (/[\.\#\$\[\]]/.test(titre)){
        alert("Les titres ne doivent pas contenir '.', '#', '$', '[', ou ']'");
        console.error("Les titres ne doivent pas contenir '.', '#', '$', '[', ou ']'");
    }
    else if(/[\#\$\[\]]/.test(description) || /[\#\$\[\]]/.test(dateLimite) || /[\#\$\[\]]/.test(horaireLimite)){
        alert("Les champs de type TEXTE ne doivent pas contenir '#', '$', '[', ou ']'");
        console.error("Les champs de type TEXTE ne doivent pas contenir '#', '$', '[', ou ']'");
    }
    else{
        var dateLimite = convertToUnixTimestamp(dateLimite, horaireLimite);
        var user_id = userProfile.sub;
    
        await writeData("user/" + user_id + "/agenda/" + titre + "/isDo", false);
        await writeData("user/" + user_id + "/agenda/" + titre + "/isPublic", "false");
        await writeData("user/" + user_id + "/agenda/" + titre + "/toDo", description);
        await writeData("user/" + user_id + "/agenda/" + titre + "/titre", titre);
        await writeData("user/" + user_id + "/agenda/" + titre + "/dateLimite", dateLimite);
        await writeData("user/" + user_id + "/agenda/" + titre + "/dateLimite", dateLimite);

        window.location.reload();
    }
}

function convertToUnixTimestamp(dateString, timeString) {
    // Concaténer la date et l'heure pour former une chaîne complète
    var dateTimeString = dateString + ' ' + timeString;

    // Créer un objet Date à partir de la chaîne
    var dateTime = new Date(dateTimeString);

    // Récupérer le timestamp Unix (en millisecondes) et le convertir en secondes
    var unixTimestamp = dateTime.getTime() / 1000;

    return unixTimestamp;
}

export async function saveNewTaskPublic(){
    event.preventDefault();

    var titre = document.getElementById('titre-public').value;
    var description = document.getElementById('description-public').value;
    var dateLimite = document.getElementById('dateLimite-public').value;
    var horaireLimite = document.getElementById('horaireLimite-public').value;
    var groupeVisee = document.getElementById('groupeVisee-public').value;

    if (titre === "" || description === "" || dateLimite === "" || horaireLimite === "" || groupeVisee === "") {
        alert("Veuillez remplir tous les champs");
        console.error("Veuillez remplir tous les champs");
    }
    else if (/[\.\#\$\[\]]/.test(titre)){
        alert("Les titres ne doivent pas contenir '.', '#', '$', '[', ou ']'");
        console.error("Les titres ne doivent pas contenir '.', '#', '$', '[', ou ']'");
    }
    else if(/[\#\$\[\]]/.test(description) || /[\#\$\[\]]/.test(dateLimite) || /[\#\$\[\]]/.test(horaireLimite)){
        alert("Les champs de type TEXTE ne doivent pas contenir '#', '$', '[', ou ']'");
        console.error("Les champs de type TEXTE ne doivent pas contenir '#', '$', '[', ou ']'");
    }
    else{
        var dateLimite = convertToUnixTimestamp(dateLimite, horaireLimite);
        await writeData("agenda/" + titre + "/isDo", "false");
        await writeData("agenda/" + titre + "/isPublic", "true");
        await writeData("agenda/" + titre + "/toDo", description);
        await writeData("agenda/" + titre + "/titre", titre);
        await writeData("agenda/" + titre + "/dateLimite", dateLimite);
        await writeData("agenda/" + titre + "/groupe", groupeVisee);
    
        window.location.reload();
    }
}

export function updateTaskIsDo(titre, isDo){
    console.log(titre + ' is do : ' + isDo);
    var user_id = userProfile.sub;
    writeData("user/" + user_id + "/agenda/" + titre + "/isDo", isDo);
    console.log('value changed !');
    window.location.reload();
}

export function deleteTask(titre){
    console.log(' try to delete : ' + titre);
    var user_id = userProfile.sub;
    deleteData("user/" + user_id + "/agenda/" + titre);
}

export function deletePublicTask(titre){
    console.log(' try to delete : ' + titre);
    deleteData("agenda/" + titre);
}

function setupAgenda() {

    var tasks = JSON.parse(agendaData);

    var taskListContainer = document.getElementById("taskListPrivate");

    // Convertir l'objet en tableau pour pouvoir le trier
    var taskArray = [];
    for (var taskKey in tasks) {
        if (tasks.hasOwnProperty(taskKey)) {
            taskArray.push(tasks[taskKey]);
        }
    }

    // Trier le tableau par date (assumant que la date est une chaîne pouvant être convertie en objet Date)
    taskArray.sort(function (a, b) {
        var dateA = new Date(a.dateLimite.value);
        var dateB = new Date(b.dateLimite.value);

        return dateA - dateB;
    });

    // Ajouter les tâches triées à la liste
    for (var i = 0; i < taskArray.length; i++) {
        (async function () {
            var task = taskArray[i];
    
            // Créer un élément HTML pour chaque tâche
            var taskElement = document.createElement("div");
            var user_id = userProfile.sub;
            await readData("user/" + user_id + "/role/").then(resultat => role = resultat);
            await readData("user/" + user_id + "/groupe/").then(resultat => groupe = resultat);

            if(task.isPublic.value == "false"){
                // Ajouter un élément span pour la croix
                var deleteButton = document.createElement("span");
                deleteButton.innerHTML = "supprimer"; // Ajoutez la croix (X)
                deleteButton.style.cursor = "pointer"; // Changez le curseur pour indiquer la possibilité de clic
                deleteButton.style.marginRight = "5px"; // Ajoutez un espace à droite de la croix
                deleteButton.classList.add('deleteButton');

                var deleteButtonContener = document.createElement("div");
                deleteButtonContener.classList.add('deleteButtonContener');
                deleteButtonContener.appendChild(deleteButton);

                // Ajoutez le bouton de suppression à l'élément de tâche
                taskElement.appendChild(deleteButtonContener);

                var isDoCheckbox = document.createElement("input");
                isDoCheckbox.type = "checkbox";
                isDoCheckbox.checked = task.isDo.value;
                isDoCheckbox.disabled = false; // Mettez à jour selon vos besoins

                var isDoCheckboxContener = document.createElement("div");
                isDoCheckboxContener.classList.add('isDoCheckboxContener');
                isDoCheckboxContener.appendChild(isDoCheckbox);

                taskElement.appendChild(isDoCheckboxContener);
                isDoCheckbox.classList.add('isDoCheckboxClass');

                // Ajoutez un événement click pour appeler deleteTask
                deleteButton.addEventListener("click", function() {
                    deleteTask(task.titre.value);
                    taskElement.remove(); // Supprime l'élément après avoir supprimé la tâche
                });

                var titleElement = document.createElement("strong");
                titleElement.textContent = task.titre.value;
                taskElement.appendChild(titleElement);
        
                var dateElement = document.createElement("div");
                dateElement.textContent = convertirTempsUnixEnString(task.dateLimite.value);
                taskElement.appendChild(dateElement);
                dateElement.classList.add('dateOfTask');
                
                var todoElement = document.createElement("div");
                todoElement.textContent = task.toDo.value;
                taskElement.appendChild(todoElement);
                todoElement.classList.add('toDoDesc');

                var colorOfTask = document.createElement("div");
                taskElement.appendChild(colorOfTask);
                colorOfTask.classList.add('colorOfTask');

                if(task.isDo.value == false){
                    if(task.dateLimite.value > nowTimestamp){
                        taskElement.classList.add('taskNotDo');
                    }
                    else{
                        taskElement.classList.add('taskNotDoAndLate');
                    }
                }
                else{
                    taskElement.classList.add('taskIsDo');
                }
        
                // Ajouter l'élément de tâche à la liste
                taskListContainer.appendChild(taskElement);
        
                // Masquer la tâche "defaultTask"
                if (task.titre.value === 'defaultTask') {
                    taskElement.style.display = 'none';
                }
        
                // Ajouter l'événement onClick directement dans le HTML
                isDoCheckbox.addEventListener("click", function() {
                    updateTaskIsDo(task.titre.value, isDoCheckbox.checked);
                });
            }
            else if(role == "ADMIN"){
                // Ajouter un élément span pour la croix
                var deleteButton = document.createElement("span");
                deleteButton.innerHTML = "supprimer"; // Ajoutez la croix (X)
                deleteButton.style.cursor = "pointer"; // Changez le curseur pour indiquer la possibilité de clic
                deleteButton.style.marginRight = "5px"; // Ajoutez un espace à droite de la croix
                deleteButton.classList.add('deleteButton');

                var deleteButtonContener = document.createElement("div");
                deleteButtonContener.classList.add('deleteButtonContener');
                deleteButtonContener.appendChild(deleteButton);

                // Ajoutez le bouton de suppression à l'élément de tâche
                taskElement.appendChild(deleteButtonContener);

                var isDoCheckbox = document.createElement("input");
                isDoCheckbox.type = "checkbox";
                isDoCheckbox.checked = task.isDo.value;
                isDoCheckbox.disabled = false; // Mettez à jour selon vos besoins

                var isDoCheckboxContener = document.createElement("div");
                isDoCheckboxContener.classList.add('isDoCheckboxContener');
                isDoCheckboxContener.appendChild(isDoCheckbox);

                taskElement.appendChild(isDoCheckboxContener);
                isDoCheckbox.classList.add('isDoCheckboxClass');

                // Ajoutez un événement click pour appeler deleteTask
                deleteButton.addEventListener("click", function() {
                    deletePublicTask(task.titre.value);
                    deleteTask(task.titre.value);
                    taskElement.remove(); // Supprime l'élément après avoir supprimé la tâche
                });

                var titleElement = document.createElement("strong");
                titleElement.textContent = task.titre.value;
                taskElement.appendChild(titleElement);
        
                var dateElement = document.createElement("div");
                dateElement.textContent = convertirTempsUnixEnString(task.dateLimite.value);
                taskElement.appendChild(dateElement);
                dateElement.classList.add('dateOfTask');
        
                var todoElement = document.createElement("div");
                todoElement.textContent = task.toDo.value;
                taskElement.appendChild(todoElement);
                todoElement.classList.add('toDoDesc');

                if(task.isDo.value == false){
                    if(task.dateLimite.value > nowTimestamp){
                        taskElement.classList.add('taskNotDo');
                    }
                    else{
                        taskElement.classList.add('taskNotDoAndLate');
                    }
                }
                else{
                    taskElement.classList.add('taskIsDo');
                }
        
                // Ajouter l'élément de tâche à la liste
                taskListContainer.appendChild(taskElement);
        
                // Masquer la tâche "defaultTask"
                if (task.titre.value === 'defaultTask') {
                    taskElement.style.display = 'none';
                }

                var colorOfTask = document.createElement("div");
                taskElement.appendChild(colorOfTask);
                colorOfTask.classList.add('colorOfTask');
        
                // Ajouter l'événement onClick directement dans le HTML
                isDoCheckbox.addEventListener("click", function() {
                    updateTaskIsDo(task.titre.value, isDoCheckbox.checked);
                });
            }
            else{
                if(task.groupe.value == "D" || task.groupe.value == groupe && role != "ADMIN"){

                     // Ajouter un élément span pour la croix
                    var deleteButton = document.createElement("span");
                    deleteButton.innerHTML = "supprimer"; // Ajoutez la croix (X)
                    deleteButton.style.cursor = "pointer"; // Changez le curseur pour indiquer la possibilité de clic
                    deleteButton.style.marginRight = "5px"; // Ajoutez un espace à droite de la croix
                    deleteButton.classList.add('deleteButton');

                    var deleteButtonContener = document.createElement("div");
                    deleteButtonContener.classList.add('deleteButtonContener');
                    deleteButtonContener.appendChild(deleteButton);
    
                    // Ajoutez le bouton de suppression à l'élément de tâche
                    taskElement.appendChild(deleteButtonContener);

                    var isDoCheckbox = document.createElement("input");
                    isDoCheckbox.type = "checkbox";
                    isDoCheckbox.checked = task.isDo.value;
                    isDoCheckbox.disabled = false; // Mettez à jour selon vos besoins
    
                    var isDoCheckboxContener = document.createElement("div");
                    isDoCheckboxContener.classList.add('isDoCheckboxContener');
                    isDoCheckboxContener.appendChild(isDoCheckbox);
    
                    taskElement.appendChild(isDoCheckboxContener);
                    isDoCheckbox.classList.add('isDoCheckboxClass');

                    // Ajoutez un événement click pour appeler deleteTask
                    deleteButton.addEventListener("click", function() {
                        deleteTask(task.titre.value);
                        taskElement.remove(); // Supprime l'élément après avoir supprimé la tâche
                    });

                    var titleElement = document.createElement("strong");
                    titleElement.textContent = task.titre.value;
                    taskElement.appendChild(titleElement);
            
                    var dateElement = document.createElement("div");
                    dateElement.textContent = convertirTempsUnixEnString(task.dateLimite.value);
                    taskElement.appendChild(dateElement);
                    dateElement.classList.add('dateOfTask');

                    var todoElement = document.createElement("div");
                    todoElement.textContent = task.toDo.value;
                    taskElement.appendChild(todoElement);
                    todoElement.classList.add('toDoDesc');
                    
                    if(task.isDo.value == false){
                        if(task.dateLimite.value > nowTimestamp){
                            taskElement.classList.add('taskNotDo');
                        }
                        else{
                            taskElement.classList.add('taskNotDoAndLate');
                        }
                    }
                    else{
                        taskElement.classList.add('taskIsDo');
                    }
            
                    // Ajouter l'élément de tâche à la liste
                    taskListContainer.appendChild(taskElement);

                    var colorOfTask = document.createElement("div");
                    taskElement.appendChild(colorOfTask);
                    colorOfTask.classList.add('colorOfTask');
            
                    // Masquer la tâche "defaultTask"
                    if (task.titre.value === 'defaultTask') {
                        taskElement.style.display = 'none';
                    }
            
                    // Ajouter l'événement onClick directement dans le HTML
                    isDoCheckbox.addEventListener("click", function() {
                        updateTaskIsDo(task.titre.value, isDoCheckbox.checked);
                    });
                }
            }
        })();
    }
}

function convertirTempsUnixEnString(tempsUnix) {
    // Créer une nouvelle instance de Date en utilisant le temps Unix (en millisecondes)
    const date = new Date(tempsUnix * 1000);
  
    // Tableaux pour les noms des jours de la semaine et des mois
    const joursSemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  
    // Obtenir le nom du jour, le numéro du jour, le mois, l'heure et les minutes
    const nomDuJour = joursSemaine[date.getDay()];
    const numeroDuJour = date.getDate();
    const moiDuTempsUnix = mois[date.getMonth()];
    const heureTempUnix = date.getHours();
    const minuteTempUnix = date.getMinutes();
  
    // Formater la chaîne résultante
    const resultat = `${nomDuJour} ${numeroDuJour} ${moiDuTempsUnix}, à ${heureTempUnix}:${minuteTempUnix < 10 ? '0' : ''}${minuteTempUnix}`;
  
    return resultat;
  }

document.addEventListener('DOMContentLoaded', () => {
    const agenda_new_task_btn = document.getElementById('agenda-new-task-btn');
    if (agenda_new_task_btn) {
        agenda_new_task_btn.addEventListener('click', saveNewTask);
    }

    const agenda_new_task_public_btn = document.getElementById('agenda-new-task-btn-public');
    if (agenda_new_task_public_btn) {
        agenda_new_task_public_btn.addEventListener('click', saveNewTaskPublic);
    }
});