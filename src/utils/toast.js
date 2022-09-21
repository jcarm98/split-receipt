import { uuidv4 } from './utils.js';

let toastStack = [];

/**
 * Creates self deleting toast messages inside of a positioned toast-container.
 * Toasts may be removed earlier by clicking on them.
 * @param {string} message - Message to display on toast
 */
export function toast(message) {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.insertBefore(container, document.body.firstChild);
    }
    if (window.innerWidth < 200) {
        alert(message);
        return;
    }
    let newToast = document.createElement("div");
    newToast.classList.add("glass-panel");
    newToast.innerHTML = message;
    let id = uuidv4();
    toastStack.push({ node: newToast, id: id });
    container.appendChild(newToast);
    function removeElement() {
        let struct = toastStack.find(s => s.id === id);
        struct.node.remove();
        toastStack.splice(toastStack.indexOf(struct), 1);
    }
    // this delay should match the delay + duration of the fade out animation for glass-panel
    let autoClose = setTimeout(() => { removeElement() }, 10000);
    newToast.addEventListener('click', () => {
        clearTimeout(autoClose);
        removeElement();
    });
}