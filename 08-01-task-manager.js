import readline from 'readline';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let connection;
mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
}).then(conn => {
  connection = conn;
  console.log('Vous êtes connecté à la base de données.');

  // Créer la table "tasks" si elle n'existe pas
  const createTasksTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      description LONGTEXT,
      status VARCHAR(255),
      created_at timestamp,
      updated_at timestamp
    );
  `;
  return connection.query(createTasksTable);
}).then(() => {
  console.log('Table "tasks" créée ou déjà existante');

  // Methode qui permet d'attendre une seconde avant d'afficher le menu principal sinon bug d'affichage
  setTimeout(() => {
    toDoList();
  }, 1000);
}).catch(err => {
  console.error('Erreur lors de la création de la table ou de la connexion:', err)
  ;
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function addTask() {
  rl.question('\nQuelle tâche voulez-vous ajouter?\n', (task) => {
    const currentTime = new Date();
    const query = `INSERT INTO tasks (description, status, created_at, updated_at) VALUES (?, ?, ?, ?)`;
    connection.query(query, [task, 'À faire', currentTime, currentTime])
        .then(() => {
          console.log(`\nTâche "${task}" ajoutée à la base de données !\n`);
          toDoList();
        })
        .catch(err => {
          console.error(`Erreur lors de l'ajout de la tâche:`, err);
          toDoList();
        });
  });
}

// Fonction qui affiche toutes les tâches stockées dans la base de données
function seeAllTasks() {
  connection.query('SELECT * FROM tasks')
      .then(([rows]) => {
        if (rows.length === 0) {
          console.log('Aucune tâche à afficher.');
        } else {
          rows.forEach(task => {
            console.log(`${task.id}. ${task.description} - ${task.status}`);
          });
        }
        toDoList();
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des tâches:', err);
        toDoList();
      });
}

// Supprime une tâche de la base de données
function deleteTask() {
  connection.query('SELECT * FROM tasks')
      .then(([rows]) => {
        if (rows.length === 0) {
          console.log('Aucune tâche à supprimer.');
          toDoList();
          return;
        }

        rows.forEach((task, index) => {
          console.log(`${index + 1}: ${task.description} - ${task.status}`);
        });

        rl.question('\nQuelle tâche voulez-vous supprimer? (indiquez le numéro)\n', (number) => {
          const taskToDelete = rows[number - 1];
          if (taskToDelete) {
            connection.query('DELETE FROM tasks WHERE id = ?', [taskToDelete.id])
                .then(() => {
                  console.log(`\nLa tâche "${taskToDelete.description}" a été supprimée !\n`);
                  toDoList();
                })
                .catch(err => {
                  console.error('Erreur lors de la suppression de la tâche:', err);
                  toDoList();
                });
          } else {
            console.log('Numéro de tâche invalide.');
            toDoList();
          }
        });
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des tâches:', err);
        toDoList();
      });
}

// Marquer une tâche comme accomplie dans la base de données
function markTask() {
  connection.query('SELECT * FROM tasks')
      .then(([rows]) => {
        if (rows.length === 0) {
          console.log('Aucune tâche à marquer comme accomplie.');
          toDoList();
          return;
        }

        rows.forEach((task, index) => {
          console.log(`${index + 1}: ${task.description} - ${task.status}`);
        });

        rl.question('\nQuelle tâche voulez-vous indiquer comme accomplie? (indiquez le numéro)\n', (number) => {
          const taskToUpdate = rows[number - 1];
          if (taskToUpdate) {
            connection.query('UPDATE tasks SET status = ? WHERE id = ?', ['Accomplie', taskToUpdate.id])
                .then(() => {
                  console.log(`\nLa tâche "${taskToUpdate.description}" a été marquée comme accomplie !\n`);
                  toDoList();
                })
                .catch(err => {
                  console.error('Erreur lors de la mise à jour de la tâche:', err);
                  toDoList();
                });
          } else {
            console.log('Numéro de tâche invalide.');
            toDoList();
          }
        });
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des tâches:', err);
        toDoList();
      });
}

// Menu principal
function toDoList() {
  rl.question(
      'Bienvenue dans votre gestionnaire de tâches ! Sélectionnez :\n' +
      '1. Voir toutes les tâches \n' +
      '2. Ajouter une tâche \n' +
      '3. Supprimer une tâche \n' +
      '4. Marquer une tâche comme accomplie \n' +
      '5. Quitter le gestionnaire de tâches\n',
      (answer) => {
        switch (answer) {
          case '1':
            seeAllTasks();
            break;
          case '2':
            addTask();
            break;
          case '3':
            deleteTask();
            break;
          case '4':
            markTask();
            break;
          case '5':
            console.log('Au revoir !');
            rl.close();
            connection.end(); // Fermer la connexion à la base de données
            break;
          default:
            toDoList();
            break;
        }
      }
  );
}
