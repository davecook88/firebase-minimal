class Task {
    constructor(body) {
        this.state = this.setState(body);
    }

    check(bool) {
        this.state.checked = bool;
        return this.getJson();
    }
    setState(body) {
        return {
            checked: false,
            title: "",
            ...body
        };
    }

    getJson() {
        return {
            checked: false,
            title: "",
            ...this.state
        };
    }
}

module.exports = Task;
