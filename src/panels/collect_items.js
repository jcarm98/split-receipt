import React from 'react';

import { toast } from '../utils/toast.js';
import { capitalize, onEnter, toDollars, uuidv4} from '../utils/utils.js';

/** ItemInputRow: Creates an editable item row with props: item, itemOnChange, price, priceOnChange, onClick, ti
 * itemOnChange, priceOnChange, item, price, onClick
 * @param {{item: string, itemOnChange: Function, price: string, priceOnChange: Function, onClick: Function, ti: number}} props 
 * item is the item name. itemOnChange is the item name updating function. price and priceOnChange are the same
 * but for the item price, and with validation. onClick is the function called to remove the item. ti is the tab index value.
 */
function ItemInputRow(props) {
    return (
        <div className="l-row l-short-bottom">
            <input
                type="text"
                className="l-item l-padding-no-button"
                onChange={(e) => props.itemOnChange(e.target.value)}
                value={props.item}
                tabIndex={props.ti}
                aria-label="added item name"
                aria-description="Editable item name in list"
            />
            <input
                type="text"
                placeholder="$___.__"
                className="l-item l-price-input"
                onChange={(e) => props.priceOnChange(e.target.value)}
                value={props.price}
                tabIndex={props.ti}
                aria-label="added item price"
                aria-description="Editable item price in list"
            />
            <div
                className="l-input-button removeable clickable-overlay"
                onClick={props.onClick}
                onKeyDown={onEnter(props.onClick)}
                tabIndex={props.ti}
                aria-label="remove item"
                aria-description="Remove item from list"
            >
                &#x00D7;
            </div>
        </div>
    );
}

/*
    Second main content panel, UI for collecting the items to be split
*/
export class CollectItems extends React.Component {
    /**
        All props are stored in parent's state or computed from parent's base functions.
        list: The list this panel acts upon with create, update, delete, and clear.
        create: Specialized function that adds new entries to the list, takes a validation function and callback function
        update: Specialized function that updates a specific entry in the list, takes a validation function and callback function
        delete: Specialized function that removes a specific entry in the list, takes a callback function
        clear: Specialized function that empties the list, takes a callback function
        next: Switches the active panel to the next state/panel using the parent's stage variable stored within its state
        back: Switches the active panel to the previous state/panel using the parent's stage variable stored within its state
        styleObject: Necessary for the carousel blur effect; When present is used to calculate its rotation and perspective, as well as disable
            any tab-able elements and inputs.
     * @param {{list: [], create: Function, update: Function, delete: Function, clear: Function, next: Function, back: Function, styleObject: object?}} props
     */
    constructor(props) {
        super(props);
        this.itemInput = React.createRef();
        this.state = {
            price: ""
        };
        this.addItem = () => {
            /* Item objects are put together from inputs before being stored in state */
            this.props.create(() => this.compile(this.itemInput.current.value, this.state.price), this.validate, () => {
                this.itemInput.current.value = "";
                this.itemInput.current.focus();
                this.setState({ price: "" });
            });
        };
    }

    /* Format the price before storing */
    compile(itemValue, priceValue) {
        let modifiedPrice = toDollars(priceValue);
        return { item: capitalize(itemValue), price: modifiedPrice, id: uuidv4() }
    }

    /* Validate the price input before adding as an item
        $1.00
        2.00
        3.55
        03.99
        45.12
     */
    validate(itemStruct) {
        if (itemStruct.item.trim().length === 0 || itemStruct.price.trim().length === 0) {
            if (itemStruct.item.trim().length === 0)
                toast("Your item is missing a name");
            if (itemStruct.price.trim().length === 0)
                toast("Your item is missing a price");
            return false;
        }
        if(itemStruct.item.trim().length > 30){
            toast("Item name cannot exceed 30 characters");
            return false;
        }
        if (itemStruct.price.match("^[$]?[0-9]+[.][0-9]{2}$") === null) {
            if (itemStruct.price.trim().length === 0 || itemStruct.price.trim() === ".00")
                toast("Your item is missing a price");
            else
                toast("Price is missing or in invalid format");
            return false;
        }
        if (itemStruct.price.trim().length > 10){
            toast("Price cannot exceed 10 characters");
            return false;
        }
        return true;
    }

    /* Validate changes to the price after it is already an item object
        $.0
        1.23
        03.45
        $50.78
        12
        1
     */
    validatePrice(value) {
        if (value.match("^[$]?[0-9]*[.]?[0-9]{0,2}$") === null) {
        }
        else {
            this.setState({ price: value });
        }
    }

    /* Used for determining tabindex, when panel is inactive, disable tabbing on those elements */
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
            <div id={this.props.styleObject ? "collect-items" : "" } className="l-main-panel" style={this.props.styleObject ? this.props.styleObject : {}}>
                <label for="stage-2-focus"><h2>Add your items</h2></label>
                {/*
                    defaultValue is used because value will prevent writing inside of the input field....
                */}
                <div className="l-row l-top-gap l-short-bottom">
                    <input
                        type="text"
                        id="stage-2-focus"
                        placeholder="Enter an item"
                        className="l-main-input l-padding-no-button"
                        ref={this.itemInput}
                        onKeyDown={onEnter(this.addItem)}
                        tabIndex={this.disable()}
                    />
                    <input
                        type="text"
                        placeholder="$___.__"
                        className="l-main-input l-price-input"
                        onChange={(e) => this.validatePrice(e.target.value)}
                        value={this.state.price}
                        onKeyDown={onEnter(this.addItem)}
                        tabIndex={this.disable()}
                        aria-label="item price input"
                        aria-description="Price for item to be added"
                    />
                    <div
                        className="l-input-button add clickable-overlay"
                        onKeyDown={onEnter(this.addItem)}
                        onClick={this.addItem}
                        tabIndex={this.disable()}
                        aria-label="add item"
                        aria-description="Add item to list"
                    >+</div>
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
