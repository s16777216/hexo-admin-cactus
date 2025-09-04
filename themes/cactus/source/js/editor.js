//#region Editor Component
class Editor extends HTMLElement {
    #textarea;
    constructor() {
        super();
        this.innerHTML = /*html*/ `
        <div>
            <textarea></textarea>
        </div>
        `;

        this.#textarea = this.querySelector('textarea');
    }

    handleInput(event) {
        const value = event.target.value;
        console.log('Input event:', value);
    }

    connectedCallback() {
        this.#textarea.addEventListener('input', this.handleInput);
    }

    disconnectedCallback() {
        this.#textarea.removeEventListener('input', this.handleInput);
    }

    get value() {
        return this.#textarea.value;
    }

    set value(val) {
        this.#textarea.value = val;
    }
}
customElements.define('hexo-editor', Editor);
//#endregion Editor Component