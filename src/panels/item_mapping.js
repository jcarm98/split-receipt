import React from 'react';
import ReactDOM from 'react-dom';

import { onEnter } from '../utils/utils.js';

/** ItemMappingRow: Creates a clickable item row with props: isConfigured, price, onClick, mapPeople, and item.
 * The row is used for all states of a mapped item, and opens a modal to edit the mapping on click.
 * @param {{isConfigured: boolean, price: string, onClick: Function, mapPeople: Function, item: string, ti: number}} props
 * isConfigured is a boolean that is used to determine the presence of the reset button for a row.
 * price is the item's price. onClick is the item/row's delete function. mapPeople is the function
 * to open the item mapping modal with the correct item. item is the item's name.
 * ti is the tabindex value.
 */
function ItemMappingRow(props) {
    let pricePiece = props.isConfigured
        ? (<div>
            <div className="l-item text-input-style l-price-input clickable-overlay">{props.item.price}</div>
            <div
                className="l-input-button removeable clickable-overlay"
                onClick={props.onClick}
                onKeyDown={onEnter(props.onClick)}
                tabIndex={props.ti}
            >
                &#x00D7;
            </div>
        </div>)
        : (<div className="l-item l-padding-no-button text-input-style l-price-input clickable-overlay">{props.item.price}</div>);
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
    return (
        <div className="rows">
            <div
                className="l-row l-short-bottom border-match"
                id={parseInt(props.index) === 0 ? "stage-3-focus" : ""}
                onClick={props.mapPeople}
                onKeyDown={onEnter(props.mapPeople)}
                tabIndex={props.ti}
            >
                <div className="l-item l-padding-no-button text-input-style clickable-overlay">{props.item.item}</div>
                {pricePiece}
            </div>
            {names && names.length > 0 ? namesContainer : ""}
        </div>
    );
}

/**
 * Creates a modal that allows the user to map people to a specific item. Returns focus to originally
 * focused element on close. Closes when clicking outside of the modal.
 * @param {{modalRef: ref, togglePerson: Function, names: Array, item: string, close: Function, update: Function}} props
 * modalRef is the React ref to the injected modal. togglePerson is a semi-configured function that
 * either adds or removes a particular person from the group of people splitting the item. names is the list of names.
 * item is the item's name. close is the forceClose function for the modal. update is item's update function for bulk operations.
 */
function ItemMapModal(props) {
    /* Modal manually manages the state of the checkbox and border color due to how
     * React state updates with changes within deeply nested structures. */
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
    /* Finished configuring togglePerson functionality for each person */
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
            <div className="l-row" key={index} onClick={(e) => props.togglePerson(e, n)}>
                <div id={"border-" + index}
                    className={"l-name l-padding-no-button text-input-style clickable-overlay " + (selected[index] ? "is-selected" : "")}
                    onClick={onClick(n, index)}
                    tabIndex="0"
                    onKeyDown={onEnter((e) => onClick(n, index)(e))}
                    style={{display: "inline-flex"}}
                >
                    <input id={"check-" + index} type="checkbox" defaultChecked={selected[index]} tabIndex="-1" />
                    {n}
                </div>
            </div>
        );
    });
    return (
        <div>
            <div className="overlay"></div>
            <div ref={props.modalRef} className="l-main-panel l-split-modal">
                <div
                    className="l-input-button modal-exit removeable clickable-overlay"
                    tabIndex="0"
                    onClick={props.close}
                    onKeyDown={onEnter(props.close)}
                >
                    &#x00D7;
                </div>
                <h3>Pick who pays</h3>

                <div className="l-row l-top-gap">
                    <div className="l-item l-padding-no-button text-input-style">{props.item.item}</div>
                    <div className="l-item l-padding-no-button text-input-style l-price-input">{props.item.price}</div>
                </div>
                {names}
                <div className="l-row l-top-gap">
                    <button className="button l-space-right" onClick={checkAll}>All</button>
                    <button className="button l-space-left" onClick={uncheckAll}>None</button>
                </div>
                <div className="l-row">
                    <button className="button" onClick={props.close}>Next</button>
                </div>
            </div>
        </div>
    );
}

/*
    Third main content panel, UI for viewing who is splitting items, and opening the editing modal.
*/
export class ItemMapping extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: undefined,
            active: undefined
        };
        /* Creates a new itemMap if there isn't one for that item already */
        this.beginMap = (itemStruct) => {
            props.create(
                () => {
                    return { ...itemStruct, names: [] };
                },
                (value) => !this.props.list.map(m => m.id).includes(value.id)
            );
            let outerIndex = -1;
            this.props.list.forEach((el, index) => { if (el.id === itemStruct.id) outerIndex = index; })
            this.openModal(outerIndex);
        }
        this.deleteMappedItem = (item) => {
            return (e) => {
                if (e) {
                    e.stopPropagation();
                    e.preventDefault();
                }
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
                if (event) event.stopPropagation();
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

    /*
        Opens an item mapping modal for a specific item and configures its closing function.
    */
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
                update={(value) => { this.props.update(index, () => value) }}
            />,
            document.getElementById('modalSlot')
        );
        setTimeout(() => { if (document.getElementById("border-0")) document.getElementById("border-0").focus() }, 200);
    }

    /* Used for determining tabindex, when panel is inactive, disable tabbing on those elements */
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
                <div className="l-row l-top-gap">
                    <button className="button" onClick={(e) => this.props.clear()} tabIndex={this.disable()}>Clear</button>
                </div>
                <div className="l-row l-top-gap">
                    <button className="button l-space-right" onClick={this.props.back} tabIndex={this.disable()}>Back</button>
                    <button className="button l-space-left" onClick={this.props.next} tabIndex={this.disable()}>Next</button>
                </div>
            </div>
        );
    }
}
