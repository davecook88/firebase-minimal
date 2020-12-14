const taskRouter = require("express").Router();
const admin = require("firebase-admin");
const Task = require("../schema/Task");

/*
* Expects payload like this:
{
	"name":"task name",
	"author": "Dave",
	"checklist":[
		{"title":"item 1", "checked":false},
		{"title":"item 2", "checked":false},
		{"title":"item 3", "checked":false}
	]
}
*
*/

taskRouter.post("/", async (req, res) => {
    const task = new Task(req.body);
    admin
        .firestore()
        .collection("tasks")
        .add(task.record)
        .then((doc) =>
            res.status(201).send({
                id: doc.id,
                ...task.record
            })
        )
        .catch((err) =>
            res.status(400).send({
                error: err.message
            })
        );
});

taskRouter.get("/", async (req, res) => {
    const snapshot = await admin.firestore().collection("tasks").get();
    let items = [];
    snapshot.forEach((doc) => {
        let id = doc.id;
        items.push({
            id: id,
            ...doc.data()
        });
    });
    res.status(200).send({ items });
});

// taskRouter.get("/:id", async (req, res) => {
//     admin
//         .firestore()
//         .collection("tasks")
//         .doc(req.params.id)
//         .get()
//         .then((doc) => {
//             const { id } = doc;
//             return res.status(200).send({
//                 items: [
//                     {
//                         ...doc.data(),
//                         id
//                     }
//                 ]
//             });
//         })
//         .catch((err) =>
//             res.status(404).send({
//                 error: err.message
//             })
//         );
// });

// taskRouter.delete("/:id", async (req, res) => {
//     admin
//         .firestore()
//         .collection("tasks")
//         .doc(req.params.id)
//         .delete()
//         .then((result) => {
//             return res.status(200).send({
//                 result
//             });
//         })
//         .catch((err) => {
//             return res.status(400).send({
//                 error: err.message
//             });
//         });
// });

module.exports = taskRouter;
