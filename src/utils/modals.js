const modalStack = [];
/**
 * Creates a confirmation modal to allow users to cancel certain actions.
 * Restores focus to originally focused element on close if there is one.
 * Cancels when clicking outside of the modal.
 * @param {string} message - Message to display
 * @param {Function} onConfirm - Function to call when confirmed
 */
export function confirm(message, onConfirm) {
    let originalFocus = document.activeElement;
    let modal = document.createElement("div");
    modal.innerHTML = `
            <div class="overlay"></div>
            <div class="l-main-panel l-split-modal l-confirm-modal">
                <div class="l-input-button modal-exit removeable clickable-overlay" tabindex="0">
                    &#x00D7;
                </div>
                ${message}
                <div class="l-row l-top-gap">
                    <button class="button l-space-right">Confirm</button>
                    <button class="button l-space-left" id="confirm-auto-focus" tabindex="0">Cancel</button>
                </div>
            </div>
        `;
    document.body.appendChild(modal);
    document.getElementById("confirm-auto-focus").focus();
    let index = modalStack.length;
    modalStack.push(modal);
    let close = (event, override = false) => {
        if (override || (modalStack.length - 1 === index && event.target !== modalStack[index].children[1] && !modalStack[index].children[1].contains(event.target))) {
            document.body.removeChild(modalStack[index]);
            modalStack.pop();
            document.removeEventListener('mousedown', close);
            originalFocus.focus();
        }
    }
    let forceClose = (event) => close(event, true);
    document.addEventListener('mousedown', close);

    // Exit button
    modal.children[1].children[0].addEventListener('click', forceClose);
    // Confirm
    modal.children[1].children[1].children[0].addEventListener('click', (event) => { onConfirm(); forceClose(event) });
    // Cancel
    modal.children[1].children[1].children[1].addEventListener('click', forceClose);
}