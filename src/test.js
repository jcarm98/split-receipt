import React from 'react';
import ReactDOM from 'react-dom';
import "./test.css"

// value for controlled inputs, defaultValue for non-controlled inputs

let toastStack = [];

function toast(message) {
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
    let autoClose = setTimeout(() => { removeElement() }, 10000);
    newToast.addEventListener('click', () => {
        clearTimeout(autoClose);
        removeElement();
    });
    // create new toast with id in stack
    // render stack in top right corner, most recent first
    // last steps, add opacity: 0 to toast with transition set to fade out after a delay
    // remove toast from stack by id after a delay, should match when the toast fades to 0
    //      maybe a little afterwards so it doesnt disappear prematurely
}

function debounce(func, timeout = 1000) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    }
}

/* eslint-disable */
// https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
/* eslint-enable */


function capitalize(str) {
    let src = str.trim();
    return src.slice(0, 1).toUpperCase() + src.slice(1).toLowerCase();
}

/** NameInputRow: props: onChange, onClick, name
 * @param {any} props Requires keys: onChange, onClick, name. onChange is a function that updates the source of the display value
 *                      with the new inputted value. onClick is a function that deletes the item when called. name is the display value.
 */
function NameInputRow(props){
    return (
        <div class="l-row l-short-bottom">
            <input type="text" class="l-name" onChange={(e) => props.onChange(e.target.value)} value={props.name} tabIndex={props.ti}/>
            <div class="l-input-button removeable clickable-overlay" onClick={props.onClick} onKeyDown={onEnter(props.onClick)} tabIndex={props.ti}>
                &#x00D7;
            </div>
        </div>
    );
}

/**
 * itemOnChange, priceOnChange, item, price, onClick
 * @param {any} props
 */
function ItemInputRow(props) {
    return (
        <div class="l-row l-short-bottom">
            <input type="text" class="l-item l-padding-no-button" onChange={(e) => props.itemOnChange(e.target.value)} value={props.item} tabIndex={props.ti}/>
            <input type="text" placeholder="$___.__" class="l-item l-price-input" onChange={(e) => props.priceOnChange(e.target.value)} value={props.price} tabIndex={props.ti}/>
            <div class="l-input-button removeable clickable-overlay" onClick={props.onClick} onKeyDown={onEnter(props.onClick)} tabIndex={props.ti}>
                &#x00D7;
            </div>
        </div>
    );
}

/**
 * isConfigured, price, onClick, mapPeople, item
 * @param {any} props
 */
function ItemMappingRow(props) {
    let pricePiece = props.isConfigured
        ? (<div>
            <div class="l-item text-input-style l-price-input clickable-overlay">{props.item.price}</div>
            <div class="l-input-button removeable clickable-overlay" onClick={(e) => { props.onClick(e); }} onKeyDown={onEnter(() => props.onClick(undefined))} tabIndex={props.ti}>
                &#x00D7;
            </div>
        </div>)
        : (<div class="l-item l-padding-no-button text-input-style l-price-input clickable-overlay">{props.item.price}</div>);
    let names = props.isConfigured
        ? props.list.find(m => m.id === props.item.id).names.map((n, index) => (
            <div className="l-attached-item l-padding-no-button l-name text-input-style" key={index} >
                {n}
            </div>
            ))
        : "";
    let namesContainer =
        (<div className="l-row l-attached-container l-short-bottom">
            {names}
        </div>);
    console.log("props.key is", props.index);
    return (
        <div className="rows">
            <div class="l-row l-short-bottom" id={parseInt(props.index) === 0 ? "stage-3-focus" : ""}onClick={props.mapPeople} style={{ borderRadius: "0.35rem" }} onKeyDown={onEnter(props.mapPeople)} tabIndex={props.ti}>
                <div class="l-item l-padding-no-button text-input-style clickable-overlay">{props.item.item}</div>
                {pricePiece}
            </div>
            {names && names.length > 0 ? namesContainer : ""}
        </div>
    );
}

/**
    person: name, amount
    list: [{item, amount}]
*/
function ResultRow(props) {
    let items = props.list.map((item, index) => (
        <div className="l-row l-short-bottom l-attached-container" key={index}>
            <div className="l-item text-input-style l-padding-no-button l-result-row">
                <div>{item.item}</div>
                <div>${toDollars(item.amount)}</div>
            </div>
        </div>
    ));
    return (
        <div className="rows">
            <div className="l-row l-top-gap l-short-bottom">
                <div className="l-name text-input-style l-padding-no-button l-result-row">
                    <div>{props.person.name}</div>
                    <div>${props.person.amount}</div>
                </div>
            </div>
            {items}
        </div>
    );
}

/**
    create
    list
    update
    delete
    keyDown
    clear
    next
 * */
class CollectNames extends React.Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
        this.addItem = () => {
            this.props.create(() => capitalize(this.input.current.value),
                (value) => value.length !== 0,
                () => {
                    this.input.current.value = "";
                    this.input.current.focus();
            });
        }
    }

    disable() {
        return this.props.styleObject ? -1 : 0;
    }

    render() {
        const names = this.props.list.map((item, index) => (
            <NameInputRow
                name={item}
                onChange={(value) => this.props.update(index, () => capitalize(value))}
                onClick={() => this.props.delete(index)}
                key={index}
                ti={this.disable()}
            />
        ));
        return (
            <div id={this.props.styleObject ? "collect-names" : ""} className="l-main-panel" style={this.props.styleObject ? this.props.styleObject : {}}>
                <h2>Add everyone paying</h2>
                <div className="l-row l-top-gap">
                    <input id="stage-1-focus" type="text" placeholder="Enter a name" className="l-main-input" ref={this.input} onKeyDown={onEnter(this.addItem)} tabIndex={this.disable()}/>
                    <div className="l-input-button add clickable-overlay" onKeyDown={onEnter(this.addItem)} onClick={this.addItem} tabIndex={this.disable()}>+</div>
                </div>
                {names}
                <div className="l-row l-top-gap l-short-bottom">
                    <button className="button l-space-right" onClick={() => this.props.clear(() => this.input.current.focus())} tabIndex={this.disable()}>Clear</button>
                    <button className="button l-space-left" onClick={this.props.next} tabIndex={this.disable()}>Next</button>
                </div>
            </div>
        );
    }
}



/**
    create
    list
    update
    delete
    keyDown
    clear
    next
    back
 * */

function toDollars(value) {
    console.log("from", value);
    let modifiedPrice = value;
    modifiedPrice = String(modifiedPrice);
    if (typeof value === "string") {
        value.trim();
    }
    if (modifiedPrice.length < 5) {
        if (modifiedPrice.indexOf('.') === -1)
            modifiedPrice += ".00";
    }
    if (modifiedPrice.indexOf('.') === modifiedPrice.length - 2)
        modifiedPrice += "0";
    while (typeof modifiedPrice === "string" && modifiedPrice.match(".[0-9]{2}[0-9]+$"))
        modifiedPrice = modifiedPrice.substring(0, modifiedPrice.length - 1);
    console.log("to: ", modifiedPrice);
    return modifiedPrice;
}

class CollectItems extends React.Component {
    constructor(props) {
        super(props);
        this.itemInput = React.createRef();
        this.state = {
            price: ""
        };
        this.addItem = () => {
            this.props.create(() => this.compile(this.itemInput.current.value, this.state.price), this.validate, () => {
                this.itemInput.current.value = "";
                this.itemInput.current.focus();
                this.setState({ price: "" });
            });
        };
    }

    compile(itemValue, priceValue) {
        let modifiedPrice = toDollars(priceValue);
        return { item: capitalize(itemValue), price: modifiedPrice, id: uuidv4() }
    }

    validate(itemStruct) {
        console.log(itemStruct);
        if (itemStruct.item.trim().length === 0 || itemStruct.price.trim().length === 0) return false;
        console.log(itemStruct);
        if (itemStruct.price.match("^[$]?[0-9]+[.][0-9]{2}$") === null) return false;
        return true;
    }

    validatePrice(value) {
        if (value.match("^[$]?[0-9]*[.]?[0-9]{0,2}$") === null) {
        }
        else {
            this.setState({price: value});
        }
    }

    disable() {
        return this.props.styleObject ? -1 : 0;
    }

    render() {
        const items = this.props.list.map((item, index) => (
            <ItemInputRow
                item={item.item}
                price={item.price}
                itemOnChange={(value) => this.props.update(index, () => this.compile(value, item.price), this.validate)}
                priceOnChange={(value) => this.props.update(index, () => this.compile(item.item, value), this.validate)}
                onClick={() => this.props.delete(index)}
                key={index}
                ti={this.disable()}
            />
        ));
        return (
            <div id={this.props.styleObject ? "collect-items" : ""} className="l-main-panel" style={this.props.styleObject ? this.props.styleObject : {}}>
                <h2>Add your items</h2>
                {/*
                    defaultValue is used because value will prevent writing inside of the input field....
                */}
                <div className="l-row l-top-gap l-short-bottom">
                    <input type="text" id="stage-2-focus" placeholder="Enter an item" className="l-main-input l-padding-no-button" ref={this.itemInput} onKeyDown={onEnter(this.addItem)} tabIndex={this.disable()}/>
                    <input type="text" placeholder="$___.__" className="l-main-input l-price-input" onChange={(e) => this.validatePrice(e.target.value)} value={this.state.price} onKeyDown={onEnter(this.addItem)} tabIndex={this.disable()}/>
                    <div className="l-input-button add clickable-overlay" onKeyDown={onEnter(this.addItem)} onClick={this.addItem} tabIndex={this.disable()}>+</div>
                </div>
                {items}
                <div className="l-row l-top-gap l-short-bottom">
                    <button className="button" onClick={() => this.props.clear(() => this.itemInput.current.focus())} tabIndex={this.disable()}>Clear</button>
                </div>
                <div className="l-row l-top-gap l-short-bottom">
                    <button className="button l-space-right" onClick={this.props.back} tabIndex={this.disable()}>Back</button>
                    <button className="button l-space-left" onClick={this.props.next} tabIndex={this.disable()}>Next</button>
                </div>
            </div>
        );
    }
}

/**
    modalRef, togglePerson, list of names, item map struct, close
*/

function ItemMapModal(props) {
    let checkAll = () => {
        let updatedItem = props.item;
        updatedItem.names = [...props.names];
        props.update(updatedItem);
        props.names.forEach((n, index) => {
            selected[index] = true;
            document.getElementById("border-" + index).classList.add("is-selected");
            document.getElementById("check-" + index).checked = selected[index];
        });
    }
    let uncheckAll = () => {
        let updatedItem = props.item;
        updatedItem.names = [];
        props.update(updatedItem);
        props.names.forEach((n, index) => {
            selected[index] = false;
            document.getElementById("border-" + index).classList.remove("is-selected");
            document.getElementById("check-" + index).checked = selected[index];
        });
    }
    console.log(props.item.names);
    function onClick(n, index) {
        return (e) => {
            selected[index] = !selected[index];
            let border = document.getElementById("border-" + index);
            if (border.classList.contains("is-selected"))
                border.classList.remove("is-selected");
            else
                border.classList.add("is-selected");
            document.getElementById("check-" + index).checked = selected[index];
            return props.togglePerson(e, n);
        }
    }
    let selected = [];
    let names = props.names.map((n, index) => {
        selected.push(props.item.names.includes(n));
        return (
            <div class="l-row" key={index} onClick={(e) => props.togglePerson(e, n)}>
                <div id={"border-" + index}
                    class={"l-name l-padding-no-button text-input-style clickable-overlay " + (selected[index] ? "is-selected" : "")}
                    onClick={onClick(n, index)}
                    tabIndex="0"
                    onKeyDown={onEnter((e) => onClick(n, index)(e))}
                >
                    <input id={"check-" + index} type="checkbox" defaultChecked={selected[index]} tabIndex="-1"/>
                    {n}
                </div>
            </div>
        );
    });
    return (
        <div>
            <div class="overlay"></div>
            <div ref={props.modalRef} class="l-main-panel l-split-modal">
                <div class="l-input-button modal-exit removeable clickable-overlay" tabIndex="0" onClick={props.close}>
                    &#x00D7;
                </div>
                <h3 style={{ color: "black" }}>Pick who pays</h3>

                <div class="l-row l-top-gap">
                    <div class="l-item l-padding-no-button text-input-style">{props.item.item}</div>
                    <div class="l-item l-padding-no-button text-input-style l-price-input">{props.item.price}</div>
                </div>
                {names}
                <div class="l-row l-top-gap">
                    <button class="button l-space-right" onClick={checkAll}>All</button>
                    <button class="button l-space-left" onClick={uncheckAll}>None</button>
                </div>
                <div class="l-row">
                    <button class="button" onClick={props.close}>Next</button>
                </div>
            </div>
        </div>
    );
}

class ItemMapping extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: undefined,
            active: undefined
        };
        this.beginMap = (itemStruct) => {
            props.create(
                () => {
                    return { ...itemStruct, names: [] };
                },
                (value) => !this.props.list.map(m => m.id).includes(value.id)
            );
            let outerIndex = -1;
            this.props.list.forEach((el, index) => { if (el.id === itemStruct.id) outerIndex = index;})
            this.openModal(outerIndex);
        }
        this.deleteMappedItem = (item) => {
            return () => {
                let outerIndex = -1;
                this.props.list.forEach((el, index) => {
                    if (el.id === item.id) {
                        outerIndex = index;
                        return;
                    }
                });
                if (this.props.list.map(m => m.id).includes(item.id))
                    this.props.delete(outerIndex);
            };
        };
        this.togglePerson = (index) => {
            return (event, name) => {
                console.log("event received:", event);
                if(event) event.stopPropagation();
                let item = this.props.list[index];
                if (item.names.includes(name))
                    item.names.splice(item.names.indexOf(name), 1);
                else
                    item.names.push(name);
                this.props.update(index, () => item);
            };
        };
        this.modalRef = React.createRef();
    }
    // toggle person takes an index 

    openModal(index) {
        if (this.state.modal) return;
        this.setState({ modal: true, active: document.activeElement });
        let close = (event, override = false) => {
            if (override || !this.modalRef.current || (event.target !== this.modalRef.current && !this.modalRef.current.contains(event.target))) {
                ReactDOM.unmountComponentAtNode(document.getElementById("modalSlot"));
                this.state.active.focus();
                this.setState({ modal: false, active: undefined });
                document.removeEventListener('mousedown', close);
            }
        }
        let forceClose = (event) => close(event, true);
        document.addEventListener('mousedown', close);
        ReactDOM.render(
            <ItemMapModal
                modalRef={this.modalRef}
                togglePerson={this.togglePerson(index)}
                names={this.props.names}
                item={this.props.list[index]}
                close={forceClose}
                update={(value) => {this.props.update(index, () => value)} }
            />,
            document.getElementById('modalSlot')
        );
        setTimeout(() => { document.getElementById("border-0").focus() }, 200);
    }

    disable() {
        return this.props.styleObject ? -1 : 0;
    }

    render() {
        // * isConfigured, value, onClick, mapPeople, item
        let items = this.props.items.map((item, index) => (
            <ItemMappingRow
                isConfigured={this.props.list.map(m => m.id).includes(item.id)}
                item={item}
                list={this.props.list}
                onClick={this.deleteMappedItem(item)}
                mapPeople={(e) => this.beginMap(item)}
                key={index}
                index={index}
                ti={this.disable()}
            />
        ));
        return (
            <div id={this.props.styleObject ? "item-mapping" : ""} className="l-main-panel" style={this.props.styleObject ? this.props.styleObject : {}}>
                <h2>Select an item</h2>
                <div className="l-top-gap">
                    {items}
                </div>
                <div class="l-row l-top-gap">
                    <button class="button" onClick={(e) => this.props.clear()} tabIndex={this.disable()}>Clear</button>
                </div>
                <div class="l-row l-top-gap">
                    <button class="button l-space-right" onClick={this.props.back} tabIndex={this.disable()}>Back</button>
                    <button class="button l-space-left" onClick={this.props.next} tabIndex={this.disable()}>Next</button>
                </div>
            </div>
        );
    }
}

function toFloat(value) {
    while (value.length > 0 && value[0].match("^[0-9]$") === null)
        value = value.slice(1);
    return value ? parseFloat(value) : 0;
}

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tax: "8.00",
            tip: "0"
        };
    }

    taxOnChange(e) {
        let value = e.target.value;
        if (String(value).match("^[0-9]*[.]?[0-9]{0,2}$") === null) { }
        else {
            this.setState({ tax: value });
        }
    }
    tipOnChange(e, percentMode, total) {
        if (percentMode) {
            let converted = toFloat(e.target.value) / 100 * total;
            console.log(e.target.value, converted);
            this.setState({ tip: toDollars(converted) });
        }
        else {
            if (String(e.target.value).match("^[$]?[0-9]*[.]?[0-9]{0,2}$") === null) { }
            else {
                this.setState({ tip: e.target.value });
            }
        }
    }
    toPercent(tip, total) {
        return toFloat(tip) && total !== 0 ? toDollars(toFloat(tip) / total * 100) : 0;
    }

    disable() {
        return this.props.styleObject ? -1 : 0;
    }

    render() {
        let items = {};
        this.props.items.forEach((item, index) => {
            item.names.forEach((name, index2) => {
                if (name in items) {
                    items[name].push({ item: item.item, amount: toFloat(item.price) / item.names.length });
                }
                else {
                    items[name] = [{ item: item.item, amount: toFloat(item.price) / item.names.length }];
                }
            });
        });
        let amounts = {};
        let rows = this.props.names.map((n, index) => {
            if (n in items && items[n])
                amounts[n] = (items[n].map(i => i.amount).reduce((prev, curr) => prev + curr, 0)) * (1 + toFloat(this.state.tax ? this.state.tax : 0)/100) + (toFloat(this.state.tip) / this.props.names.length);
            return (
                <ResultRow
                    person={{ name: n, amount: amounts[n] ? toDollars(amounts[n]) : "0" }}
                    list={items[n] ? items[n] : []}
                    key={index}
                />
            );
        });
        let total = 0;
        for (let key in amounts)
            total += (items[key].map(i => i.amount).reduce((prev, curr) => prev + curr, 0));
        let subtotal = total;
        total = total * (1 + toFloat(this.state.tax ? this.state.tax : 0) / 100) + toFloat(this.state.tip);
        return (
            <div id={this.props.styleObject ? "results" : "" } className="l-main-panel" style={this.props.styleObject ? this.props.styleObject : {}}>
                <div className="top-gap l-result-container">
                    <div style={{ marginBottom: "0.25rem"}}>
                        Tax:&nbsp;
                        <input type="text" placeholder="8.00" className="l-result-input l-padding-no-button" value={this.state.tax} onChange={(e) => this.taxOnChange(e)} tabIndex={this.disable()}/>
                        &nbsp;% = {`$${toDollars(subtotal * (this.state.tax / 100))}`}
                    </div>
                    <div style={{ marginBottom: "0.25rem" }}>
                        Tip:&nbsp;$&nbsp;
                        <input type="text" placeholder="$5.00" className="l-result-input l-padding-no-button" onChange={(e) => this.tipOnChange(e, false, subtotal)} value={this.state.tip} tabIndex={this.disable()}/>&nbsp;= %&nbsp;{this.toPercent(this.state.tip, subtotal)}
                    </div>
                </div>
                {rows}
                <div>
                    Total: {`$${toDollars(total)}`}
                </div>
                <div className="l-row l-top-gap">
                    <button className="button" onClick={this.props.back} tabIndex={this.disable()}>Back</button>
                </div>
            </div>
        );
    }
}

const NAMECOLLECTION = 'nameCollection';
const ITEMCOLLECTION = 'itemCollection';
const ITEMMAPPING = 'itemMapping';
const RESULTS = 'results';

const modalStack = [];
function confirm(message, onConfirm) {
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

function onEnter(enterFunc) {
    return (e) => {
        if (e.key === "Enter")
            enterFunc();
    }
}

const NAMES = 'names';
const ITEMS = 'items';
const MAPPEDITEMS = 'mappedItems';

const ListEnum = {
    names: 0,
    items: 1,
    mappedItems: 2,
    stage: 3
};

class Router extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            names: [],
            mappedItems: [],
            stage: NAMECOLLECTION,
        };
    }

    keyToList(stateKey, stateOwner = this) {
        switch (ListEnum[stateKey]) {
            case 0:
                return stateOwner.state.names;
            case 1:
                return stateOwner.state.items;
            case 2:
                return stateOwner.state.mappedItems;
            default:
        }
    }

    storeToKey(stateKey, value, setStateCB = undefined, stateOwner = this) {
        console.log(stateKey, "is now", value);
        switch (ListEnum[stateKey]) {
            case 0:
                stateOwner.setState({
                    names: value
                }, setStateCB);
                break;
            case 1:
                stateOwner.setState({
                    items: value
                }, setStateCB);
                break;
            case 2:
                stateOwner.setState({
                    mappedItems: value,
                }, setStateCB);
                break;
            case 3:
                stateOwner.setState({
                    stage: value,
                }, setStateCB);
                break;
            default:
                break;
        }
    }

    /**
     * create:
        list to modify
        item to add
        setstate cb
        state owner
     **/

    /**
     update:
        list to modify
        index to modify
        value to overwrite with
        update validation
        setstate cb
        state owner
     * */

    /**
     destroy:
        list to modify
        index to remove
        setstate cb
        state owner
     * */


    create(list, stateOwner = this) {
        return (value, validation = undefined, setStateCB = undefined) => {
            console.log("attempting to create:", list, value());
            if (validation && !validation(value())) return;
            let stateList = this.keyToList(list);
            stateList.push(value());
            this.storeToKey(list, stateList, setStateCB, stateOwner);
        }
    }

    update(list, stateOwner = this) {
        return (index, value, validation = undefined, setStateCB = undefined) => {
            if (validation && !validation(value())) return;
            let stateList = this.keyToList(list);
            stateList[index] = value();
            this.storeToKey(list, stateList, setStateCB, stateOwner);
        }
    }

    delete(list, stateOwner = this) {
        return (index, setStateCB = undefined) => {
            let stateList = this.keyToList(list);
            stateList.splice(index, 1);
            this.storeToKey(list, stateList, setStateCB, stateOwner)
        }
    }

    clear(list) {
        return (callback = undefined) => {
            confirm("Are you sure you want to clear this list?", () => { this.storeToKey(list, []); if (callback) callback() });
        }
    }

    setStage(stage) {
        if (this.state.stage === NAMECOLLECTION) {
            if (this.state.names.length < 2) {
                toast("You need to have at least two people to split items");
                return;
            }
        }
        if (this.state.stage === ITEMCOLLECTION) {
            if (this.state.items.length < 1 && stage !== NAMECOLLECTION) {
                toast("You need at least one item to split");
                return;
            }
        }
        if (this.state.stage === ITEMMAPPING && stage !== ITEMCOLLECTION) {
            let prevent = false;
            this.state.items.forEach(item => {
                let mapped = this.state.mappedItems.find(m => m.id === item.id);
                if (!mapped) {
                    toast(`Split ${item.item} before continuing`);
                    prevent = true;
                }
                else if(mapped.names.length < 1) {
                    toast(`${item.item} isn't being paid by anyone`);
                    prevent = true;
                }
            });
            if (prevent) {
                return;
            }
        }
        if (stage === NAMECOLLECTION) {
            document.getElementById("stage-1-focus").focus();
        }
        else if (stage === ITEMCOLLECTION) {
            document.getElementById("stage-2-focus").focus();
        }
        else if (stage === ITEMMAPPING) {
            document.getElementById("stage-3-focus").focus();
        }
        if (stage === ITEMCOLLECTION) {
            let dedupedNames = this.state.names.sort((a, b) => a > b);
            let names = {};
            for (let i = 0; i < dedupedNames.length; i++) {
                if (dedupedNames[i] in names) {
                    names[dedupedNames[i]] += 1;
                    dedupedNames[i] += ` (${names[dedupedNames[i]]})`;
                }
                else {
                    names[dedupedNames[i]] = 1;
                }
            }
            this.setState({
                names: dedupedNames
            });
        }
        if (stage === ITEMMAPPING) {
            let dedupedItems = this.state.items.sort((a, b) => a.item > b.item);
            let items = {};
            for (let i = 0; i < dedupedItems.length; i++) {
                if (dedupedItems[i].item in items) {
                    items[dedupedItems[i].item] += 1;
                    dedupedItems[i].item += ` (${items[dedupedItems[i].item]})`;
                }
                else {
                    items[dedupedItems[i].item] = 1;
                }
            }
            this.setState({
                items: dedupedItems
            });
        }
        if (stage === ITEMCOLLECTION || stage === NAMECOLLECTION || stage === ITEMMAPPING || stage === RESULTS) {
            this.storeToKey("stage", stage);
        }
    }

    render() {
        const base = {
            "--abs-offset": 0,
            "--offset": 0,
            "--direction": 0,
            "--x-scale": 0,
            "--x-offset": 0
        };
        const right1 = {
            "--abs-offset": 0.33,
            "--offset": -0.33,
            "--direction": -1,
            "--x-scale": 0.5,
            "--x-offset": 5
        };
        const right2 = {
            "--abs-offset": 0.66,
            "--offset": -0.66,
            "--direction": -1,
            "--x-scale": 0.75,
            "--x-offset": -10
        };
        const left1 = {
            "--abs-offset": 0.33,
            "--offset": 0.33,
            "--direction": 1,
            "--x-scale": 0.5,
            "--x-offset": -5,
            "left": "-50%"
        };
        const left2 = {
            "--abs-offset": 0.66,
            "--offset": 0.66,
            "--direction": 1,
            "--x-scale": 0.75,
            "--x-offset": 10,
            "left": "-50%"
        };
        let styles = [{ ...base }, { ...base }, { ...base }, { ...base }];
        if (this.state.stage === NAMECOLLECTION) {
            styles[0] = undefined;
            styles[1] = {...right1};
            styles[2] = {...right2}
            styles[3] = {
                "--abs-offset": 1,
                "--offset": -1,
                "--direction": -1,
                "--x-scale": 0.875,
                "--x-offset": -10
            }; 
        }
        else if (this.state.stage === ITEMCOLLECTION) {
            styles[0] = {...left1};
            styles[1] = undefined;
            styles[2] = {...right1}
            styles[3] = {...right2}
        }
        else if (this.state.stage === ITEMMAPPING) {
            styles[0] = {...left2}
            styles[1] = { ...left1 };
            styles[2] = undefined;
            styles[3] = {...right1};
        }
        else if (this.state.stage === RESULTS) {
            styles[0] = {
                "--abs-offset": 1,
                "--offset": 1,
                "--direction": 1,
                "--x-scale": 0.875,
                "--x-offset": 10,
                "left": "-50%"
            };
            styles[1] = {...left2}
            styles[2] = {...left1}
            styles[3] = undefined;
        }
        return (
            <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
                <header>
                    <h1 className="margin-center" id="header-test">Split Receipt</h1>
                </header>
                <main>
                    <div class="carousel">
                        <CollectNames
                            list={this.state.names}
                            create={this.create(NAMES)}
                            update={this.update(NAMES)}
                            delete={this.delete(NAMES)}
                            clear={this.clear(NAMES)}
                            next={() => this.setStage(ITEMCOLLECTION)}
                            styleObject={styles[0]}
                        />
                        <CollectItems
                            list={this.state.items}
                            create={this.create(ITEMS)}
                            update={this.update(ITEMS)}
                            delete={this.delete(ITEMS)}
                            clear={this.clear(ITEMS)}
                            next={() => this.setStage(ITEMMAPPING)}
                            back={() => this.setStage(NAMECOLLECTION)}
                            styleObject={styles[1]}
                        />
                        <ItemMapping
                            list={this.state.mappedItems}
                            names={this.state.names}
                            items={this.state.items}
                            create={this.create(MAPPEDITEMS)}
                            update={this.update(MAPPEDITEMS)}
                            delete={this.delete(MAPPEDITEMS)}
                            clear={this.clear(MAPPEDITEMS)}
                            next={() => this.setStage(RESULTS)}
                            back={() => this.setStage(ITEMCOLLECTION)}
                            styleObject={styles[2]}
                        />
                        <Results
                            names={this.state.names}
                            items={this.state.mappedItems}
                            back={() => this.setStage(ITEMMAPPING)}
                            styleObject={styles[3]}
                        />
                    </div>
                </main>
                <footer>
                    <div className="l-footer-wrapper">
                        <a className="l-footer-panel" href="https://mrcarmona.com">My Portfolio</a>
                    </div>
                </footer>
                <div id="modalSlot"></div>
            </div>
        );
    }
}

ReactDOM.render(
    <Router id="router" />,
    document.getElementById('test')
);

/*
todo:
    1. finalize wording in panels, footer with link to portfolio
    2. stage changes require conditions, if not met then toast
    3. upload to git, push to staging, move website to new server
    4. test and update infra deployment instructions
        should be able to move everything to a new virtual machine: main, staging, v1
    5. clean up, split, and document css
    6. clean up, split, and document js

*/