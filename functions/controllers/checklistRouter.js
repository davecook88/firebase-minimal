const checklistRouter = require("express").Router();
const Task = require("../schema/Task");
const admin = require("firebase-admin");

const getTask = (taskId) => {
    return admin
        .firestore()
        .collection("tasks")
        .doc(taskId)
        .get()
        .then((doc) => doc.data())
        .catch((err) =>
            res.status(404).send({
                error: err.message,
                message: "Error getting task " + res.params.taskId
            })
        );
};

checklistRouter.get("/:taskId/checklist", async (req, res) => {
    console.log("checklistRouter.get", req.params.taskId);
    const task = await admin
        .firestore()
        .collection("tasks")
        .doc(req.params.taskId)
        .get()
        .then((doc) => doc.data())
        .catch((err) =>
            res.status(404).send({
                error: err.message,
                message: "Error getting task " + res.params.taskId
            })
        );
    return res.status(200).send({
        items: task.checklist
    });
});

checklistRouter.post("/:taskId/checklist", async (req, res) => {
    console.log("checklistRouter");
    console.log("task id", req.params.taskId);
    console.log("req.body", req.body);
    const task = await getTask(req.params.taskId);
    console.log("got task", task);
    if (!task) {
        res.status(404).send({
            error: "no task found for id: " + req.params.taskId
        });
    }
    const taskObj = new Task(task);
    /*
      An unchecked checkbox isn't sent by a form 
      This checks the values received against the indexes available in the array
    */

    const checkedIndexes = Object.keys(req.body);
    const updatedTask = taskObj.updateChecklists(checkedIndexes);
    admin
        .firestore()
        .collection("tasks")
        .doc(req.params.taskId)
        .set(updatedTask, { merge: true })
        .then(() => {
            return res.status(201).send({
                id: req.params.taskId,
                updatedTask
            });
        })
        .catch((err) =>
            res.status(400).send({
                error: err.message
            })
        );
});

module.exports = checklistRouter;
