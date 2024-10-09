import readline from 'readline';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv'; //importe un fichier .env afin de stocker les logins et ne pas les push

dotenv.config(); // config du fichier .env

let connection;
mysql.createConnection({
  host: process.env.DB_HOST, //voir fichier .env
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
      updated_at timestamp,
      priority int            
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

async function addTask() {
  rl.question('\nQuelle tâche voulez-vous ajouter?\n', async(task) => {
     try {
           const currentTime = new Date();
           const query = `INSERT INTO tasks (description, status, created_at, updated_at, priority)
                     VALUES (?, ?, ?, ?, ?)`;
           await connection.query(query, [task, 'À faire', currentTime, currentTime, 3]);

           console.log(`\nTâche "${task}" ajoutée à la base de données !\n`);
           toDoList();
  } catch(err) {
           console.error(`Erreur lors de l'ajout de la tâche:`, err);
           toDoList();
        }
  });
}


async function seeAllTasks() {
  try {
        const [rows] = await connection.query('SELECT * FROM tasks')

        if (rows.length === 0) {
          console.log('Aucune tâche à afficher.');
        } else {
          rows.forEach(task => {
            console.log(`${task.id}. ${task.description} - ${task.status} - ${task.priority}`);
          });
        }
        toDoList();
      } catch (err) {
        console.error('Erreur lors de la récupération des tâches:', err);
        toDoList();
      }
}


async function deleteTask() {
    try {
         const [rows] = await connection.query('SELECT * FROM tasks');
         if (rows.length === 0) {
          console.log('Aucune tâche à supprimer.');
          toDoList();
          return;
        }

        rows.forEach((task, index) => {
          console.log(`${index + 1}: ${task.description} - ${task.status} - ${task.priority}`);
        });

        rl.question('\nQuelle tâche voulez-vous supprimer? (indiquez le numéro)\n', async(number) => {
          const taskToDelete = rows[number - 1];
          if (taskToDelete) {
              try {
            await connection.query('DELETE FROM tasks WHERE id = ?', [taskToDelete.id]);

                  console.log(`\nLa tâche "${taskToDelete.description}" a été supprimée !\n`);
                  toDoList();
                } catch(err) {
                  console.error('Erreur lors de la suppression de la tâche:', err);
                  toDoList();
                }
          } else {
            console.log('Numéro de tâche invalide.');
            toDoList();
          }
        });
      } catch(err) {
        console.error('Erreur lors de la récupération des tâches:', err);
        toDoList();
      }
}

async function markTask() {
    try {
  const [rows] = await connection.query('SELECT * FROM tasks')
        if (rows.length === 0) {
          console.log('Aucune tâche à marquer comme accomplie.');
          toDoList();
          return;
        }

        rows.forEach((task, index) => {
          console.log(`${index + 1}: ${task.description} - ${task.status} - ${task.priority}`);
        });

        rl.question('\nQuelle tâche voulez-vous indiquer comme accomplie? (indiquez le numéro)\n', async(number) => {
          const taskToUpdate = rows[number - 1];
          if (taskToUpdate) {
              try {
              await connection.query('UPDATE tasks SET status = ? WHERE id = ?', ['Accomplie', taskToUpdate.id])
              console.log(`\nLa tâche "${taskToUpdate.description}" a été marquée comme accomplie !\n`);
              toDoList()
          } catch (err) {
                  console.error('Erreur lors de la mise à jour de la tâche:', err);
                  toDoList();
                }
          } else {
            console.log('Numéro de tâche invalide.');
            toDoList();
          }
        });
      } catch(err) {
        console.error('Erreur lors de la récupération des tâches:', err);
        toDoList();
      }
}

async function filterByStatus() {
    rl.question('filtrer les tâches par statut: \n' +
        '1. Voir les tâches "À faire" \n' +
        '2. Voir les tâches "Accomplie"\n',
        async(number) => {
            const task = await connection.query('SELECT * FROM tasks')
        if (number === '1') {
            task.status = 'À faire';
        } else if (number === '2') {
            task.status = 'Accomplie';
        } else {
            console.log('Choix non valide');
            toDoList();
            return;
        }

        try {
            const [rows] = await connection.query('SELECT * FROM tasks WHERE status = ?', [task.status]);
            if (rows.length === 0) {
                console.log (`il n'y a aucune tâche avec le statut "${task.status}".`);
            } else {
                rows.forEach(task => {
                    console.log(`${task.id}. ${task.description} - ${task.status} - ${task.priority}`);
                });
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des tâches:', err);
        }
        toDoList();
        })
}


async function searchByKeyword(){
rl.question('rechercher par mot clé: \n' +
'Quel mot clé voulez-vous indiquer pour la recherche?\n', async(answer) => {
    if (!answer.trim()) {
        console.log ('mot clé inexistant');
    toDoList();
    return;
    }
    try {
        const[rows] = await connection.query(`SELECT * FROM tasks WHERE description LIKE ?`, [`%${answer}%`]);
        if (rows.length === 0) {
            console.log(`il n'y a aucune tâche avec le mot clé "${answer}".`);
        } else {
            rows.forEach(task => {
                console.log(`${task.id}. ${task.description} - ${task.status} - ${task.priority}`);
            });
        }
    } catch (err) {
        console.error('Erreur lors de la recherche par mot clé:', err);
    }
    toDoList();
})
}

async function sortedByDateOrStatus() {
    rl.question('Voulez-vous trier par date ou par statut?: \n' +
    '1. Par date\n' +
    '2. Par statut\n', async(answer) => {
        let sortedBy;
        switch (answer) {
            case '1':
            sortedBy = 'updated_at';
            break;
            case '2':
                sortedBy = 'status';
                break;
            default:
                console.log('Choix invalide');
                toDoList();
                return;
        }
        try {
            const[rows] = await connection.query(`SELECT * FROM tasks ORDER BY ${sortedBy}`);
            if (rows.length === 0) {
                console.log('Aucune tâche à afficher');
            } else {
                rows.forEach(task => {
                    console.log(`${task.id}. ${task.description} - ${task.status} - ${task.priority} - modifié le ${task.updated_at}`);
                });
            }
        } catch (err) {
            console.error('Erreur lors du tri des tâches', err);
        }
        toDoList();
    })
}

async function priorityAdd(){
    try {
        const [rows] = await connection.query ('SELECT * FROM tasks');
        if (rows.length === 0) {
            console.log('Aucune tâche à prioriser');
            toDoList();
            return;
        }
        rows.forEach((task, index) => {
            console.log(`${index + 1}. ${task.description} - ${task.status} - ${task.priority}`);
        });
        rl.question('De quelle tâche voulez-vous modifier la priorité? (indiquer le numéro)\n', async(number) => {
            const taskToPriorize = rows[number -1];
            if (!taskToPriorize) {
                console.log('Numéro de tâche pas valide');
                toDoList();
                return;
            }
            rl.question('Quelle priorité voulez-vous assigner à la tâche?\n' +
            '1: Haute\n' +
            '2: Moyenne\n' +
            '3: Basse\n', async (priorityChoice) => {
                let prioAdd;
                switch (priorityChoice) {
                    case '1':
                        prioAdd = 1;
                        break;
                        case '2':
                            prioAdd = 2;
                            break;
                            case '3':
                                prioAdd = 3;
                                break;
                    default:
                                    console.log('Choix de priorité pas valide');
                                    toDoList();
                                    return;
                }
                try {
                    await connection.query('UPDATE tasks SET priority = ? WHERE id = ?', [prioAdd, taskToPriorize.id]);
                    console.log(`\nLa priorité de la tâche "${taskToPriorize.description}" a été modifiée`)
                } catch (err) {
                    console.error('erreur lors de la modification de la priorité de la tâche', err);
                }
                toDoList();
            });
        });
    } catch (err) {
        console.log('Erreur lors de la recupération des tâches', err);
        toDoList();
    }
}


//Menu principal
function toDoList() {
  rl.question(
      'Bienvenue dans votre gestionnaire de tâches ! Sélectionnez :\n' +
      '1. Voir toutes les tâches \n' +
      '2. Ajouter une tâche \n' +
      '3. Supprimer une tâche \n' +
      '4. Marquer une tâche comme accomplie \n' +
      '5. Filtrer les tâches par statut \n' +
      '6. Chercher une tâche par mot clé\n' +
      '7. Trier les tâches par date ou statut\n' +
      '8. Prioriser une tâche(1:Haute, 2: Moyenne, 3:Basse) \n' +
      '9. Quitter le gestionnaire de tâches\n',
      async (answer) => {
          switch (answer) {
                        case '1':
                        await seeAllTasks();
                        break;
                        case '2':
                        await addTask();
                        break;
                        case '3':
                        await deleteTask();
                        break;
                        case '4':
                        await markTask();
                        break;
                        case '5':
                        await filterByStatus();
                        break;
                        case '6':
                        await searchByKeyword();
                        break;
                        case '7':
                        await sortedByDateOrStatus();
                        break;
                        case '8':
                        await priorityAdd();
                        break;
                        case '9':
                        console.log('Au revoir !');
                        rl.close();
                        connection.end();
                        break;
                        default:
                        toDoList();
                        break;
        }
      }
  );
}
