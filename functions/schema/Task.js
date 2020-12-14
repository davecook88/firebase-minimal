const ChecklistItem = require("./ChecklistItem");
// const Comment = require("./Comment");

class Task {
    constructor(body) {
        this.record = this.createRecord(body);
    }

    // addComment(formComment) {
    //     console.log("formComment", formComment);
    //     const index = this.record.comments.length;
    //     const comment = new Comment({ ...formComment, index });
    //     this.record.comments.push(comment.getJson());
    //     return this.record;
    // }

    createRecord(body) {
        console.log("createRecord", body);
        const date = new Date();
        const timestamp = date.toISOString();
        const checklist = body.checklist || [];
        const checklistItems = checklist.map((checklistBody, index) => {
            const newChecklistItem = new ChecklistItem({
                ...checklistBody,
                index
            });
            return newChecklistItem.getJson();
        });
        const comments = body.comments || [];
        const commentItems = comments.map((comment, index) => {
            const newComment = new Comment({
                ...comment,
                index
            });
            return newComment.getJson();
        });
        // const id = uuidv4();
        const record = {
            created_at: timestamp,
            updated_at: timestamp,
            name: "",
            description: "",
            author: "",
            ...body,
            checklist: checklistItems,
            comments: commentItems
        };

        return record;
    }

    updateChecklist(body) {
        console.log("updateChecklist", body, this);
        if (isNaN(body.index)) return { error: "checklist body has no index" };
        const index = body.index;
        const checklist = [...this.record.checklist];
        console.log(checklist.length - 1, index);
        if (checklist.length - 1 < index)
            return { error: "checklist index out of range: index " + index };
        const updatedItem = { ...checklist[index], ...body };
        this.record.checklist[index] = updatedItem;
        return this.record;
    }

    updateChecklists(checkedIndexArray = []) {
        const updatedChecklist = this.record.checklist.map((checklistItem) => {
            const index = String(checklistItem.index);
            const newChecklistItem = { ...checklistItem };
            newChecklistItem.checked = checkedIndexArray.includes(index);
            return newChecklistItem;
        });
        this.record.checklist = updatedChecklist;
        return this.record;
    }
}

module.exports = Task;
