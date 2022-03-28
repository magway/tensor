import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://jsonplaceholder.typicode.com"

export default class TodoList {
    element;
    body;
    userId = 0;
    data = [];
    loading = false;

    constructor({
        userID = 1
    } = {}) {

        this.userId = userID;
        this.url = BACKEND_URL + `/users/${userID}/todos`;

        this.render();
    }

    /**
     * Render function: creates component DOM-node and stores it in the 'element' field
     */
    async render() {
        const wrapper = document.createElement('div');

        wrapper.innerHTML = this.getMarkup();

        this.element = wrapper.firstElementChild;
        this.body = this.element.querySelector('.todo-list__body');

        this.setLoading(true);

        //fetch some data asynchronously
        const data = await fetchJson(this.url);

        //for a better view let's leave 10 rows
        this.renderRows(data.slice(0, 10));

        this.setLoading(false);

        this.dispatchLoadedEvent();
    }

    /**
     * Render function for component DOM-node creation
     */
    renderRows(data = []) {
        if (data.length) {
            this.element.classList.remove('todo-list--empty');
            this.data = data;
            this.body.innerHTML = this.getTableRows(data);
        } else {
            this.element.classList.add('todo-list--empty');
        }
    }

    /**
     * Return HTML of the list rows
     *
     * @param data
     * @returns HTML
     */
    getTableRows(data) {
        return data.map(({id, title, completed}) => `
            <div class="todo-list__row">
                <div class="todo-list__cell">${id}</div>
                <div class="todo-list__cell">${title}</div>
                <div class="todo-list__cell ${ completed ? 'success' : 'error'}">${ completed ? 'Done' : 'waiting'}</div>
            </div>`
        ).join('');
    }

    /**
     * Static HTML for component
     */
    getMarkup() {
        return `
            <div class="todo-list">
                <div class="todo-list__head">
                    <div class="todo-list__row todo-list__row--header">
                        <div class="todo-list__cell todo-list__cell--head">Id</div>
                        <div class="todo-list__cell todo-list__cell--head">Title</div>
                        <div class="todo-list__cell todo-list__cell--head">Status</div>
                    </div>
                </div>

                <div class="todo-list__body"></div>

                <div class="todo-list__placeholder">Loading...</div>

                <div class="todo-list__empty-body">No items</div>
            </div>
        `
    }

    /**
     * Set/Unset loading state of the list
     * @param isLoading bool
     */
    setLoading(isLoading = false) {
        this.loading = isLoading;
        this.element.classList.toggle('todo-list--loading', isLoading);
    }

    /**
     * Destroy list to clean up the memory.
     * Just in case
     */
    destroy() {
        this.element.remove();
        this.body = null;
    }

    /**
     * Dispatch event after successful data fetch
     */
    dispatchLoadedEvent() {
        const event = new CustomEvent('data-loaded');
        this.element.dispatchEvent(event);
    }
}