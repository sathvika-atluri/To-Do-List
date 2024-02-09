const express = require('express');
const router = express.Router();
const Query = require('./database');

//function to create a task
router.post('/CreateTask', (req, res) => {
    const task = req.body;
    const email = task.email;
    const category = task.category;

    //here getting USER_ID based on email using parameterized query
    const selectUserIdSQL = 'SELECT USER_ID FROM APP_USERS WHERE EMAIL = :email';
    const selectUserIdParams = { email: email };

    Query(selectUserIdSQL, selectUserIdParams)
        .then((result) => {
            const userId = result.rows[0].USER_ID;

            //here insert the task with category using parameterized query
            const insertTaskSQL = `INSERT INTO APP_TASKS(USER_ID, TASK_NAME, DESCRIPTION, STATUS, DUE_DATE, CATEGORY, CREATE_DATE, UPDATED_DATE)
                                   VALUES (:userId, :taskName, :description, 'PENDING', TO_DATE(:dueDate, 'YYYY-MM-DD'), :category, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
            const insertTaskParams = {
                userId: userId,
                taskName: task.taskName,
                description: task.description,
                dueDate: task.dueDate,
                category: category
            };

            return Query(insertTaskSQL, insertTaskParams);
        })
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.error('Error creating task:', error);
            res.status(500).send('Internal Server Error');
        });
});

//searching the tasks based on the category
router.get('/GetTasks/:email/:category', (req, res) => {
    const email = req.params.email;
    const category = req.params.category;

    const selectTasksSQL = `SELECT * FROM APP_TASKS
                            WHERE USER_ID = (SELECT USER_ID FROM APP_USERS WHERE EMAIL = '${email}')
                            AND CATEGORY = '${category}'`;

    Query(selectTasksSQL)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            res.send(error);
        });
});


//function to update a task
router.put('/UpdateTask/:task_id', (req, res) => {
    const task_id = req.params.task_id;
    const updatedTask = req.body;

    const updateSQL = `UPDATE APP_TASKS 
                       SET TASK_NAME = '${updatedTask.task_name}',
                           DESCRIPTION = '${updatedTask.description}',
                           STATUS = '${updatedTask.status}',
                           DUE_DATE = TO_DATE('${updatedTask.due_date}', 'YYYY-MM-DD'),
                           UPDATED_DATE = CURRENT_TIMESTAMP
                       WHERE TASK_ID = ${task_id}`;

    Query(updateSQL)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            res.send(error);
        });
});

//function to delete a task
router.delete('/DeleteTask/:task_id', (req, res) => {
    const task_id = req.params.task_id;

    const deleteSQL = `DELETE FROM APP_TASKS WHERE TASK_ID = ${task_id}`;

    Query(deleteSQL)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            res.send(error);
        });
});

// Function to get tasks based on user's email
router.get('/GetTasks/:email', (req, res) => {
    const email = req.params.email;

    const selectTasksSQL = `SELECT * FROM APP_TASKS
                            WHERE USER_ID = (SELECT USER_ID FROM APP_USERS WHERE EMAIL = '${email}')`;

    Query(selectTasksSQL)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            res.send(error);
        });
});
//function for getting completed tasks based on the user's emial
router.get('/GetCompletedTasks/:email', (req, res) => {
    const email = req.params.email;

    const selectCompletedTasksSQL = `SELECT * FROM APP_TASKS
                                     WHERE USER_ID = (SELECT USER_ID FROM APP_USERS WHERE EMAIL = '${email}')
                                     AND STATUS = 'COMPLETE'`;

    Query(selectCompletedTasksSQL)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            res.send(error);
        });
});

//function to get pending tasks based on user's email
router.get('/GetPendingTasks/:email', (req, res) => {
    const email = req.params.email;

    const selectPendingTasksSQL = `SELECT * FROM APP_TASKS
                                   WHERE USER_ID = (SELECT USER_ID FROM APP_USERS WHERE EMAIL = '${email}')
                                   AND STATUS = 'PENDING'`;

    Query(selectPendingTasksSQL)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            res.send(error);
        });
});
//function to get the ongoing task till to the due date
router.get('/GetOngoingTasks/:email', (req, res) => {
    const email = req.params.email;

    const selectOngoingTasksSQL = `SELECT * FROM APP_TASKS
                                   WHERE USER_ID = (SELECT USER_ID FROM APP_USERS WHERE EMAIL = '${email}')
                                   AND STATUS = 'PENDING'
                                   AND DUE_DATE >= CURRENT_DATE`;

    Query(selectOngoingTasksSQL)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            res.send(error);
        });
});

module.exports = router;
