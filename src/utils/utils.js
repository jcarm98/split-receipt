export function capitalize(str) {
    let src = str.trim();
    return src.slice(0, 1).toUpperCase() + src.slice(1).toLowerCase();
}

export function debounce(func, timeout = 1000) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    }
}

export function onEnter(enterFunc) {
    return (e) => {
        if (e.key === "Enter")
            enterFunc(e);
    }
}

export function toDollars(value) {
    let modifiedPrice = value;
    modifiedPrice = String(modifiedPrice);
    if (typeof value === "string") {
        value.trim();
    }
    if (modifiedPrice.indexOf('.') === -1)
        modifiedPrice += ".00";
    if (modifiedPrice.indexOf('.') === modifiedPrice.length - 2)
        modifiedPrice += "0";
    /*
        .000
        0.111
        $.987654321
     */
    while (typeof modifiedPrice === "string" && modifiedPrice.match("[.][0-9]{2}[0-9]+$"))
        modifiedPrice = modifiedPrice.substring(0, modifiedPrice.length - 1);
    return modifiedPrice;
}

export function toFloat(value) {
    while (value.length > 0 && value[0].match("^[0-9]$") === null)
        value = value.slice(1);
    return value ? parseFloat(value) : 0;
}

/* eslint-disable */
// https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
export function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
/* eslint-enable */