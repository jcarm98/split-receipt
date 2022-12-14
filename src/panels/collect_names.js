import React from 'react';

import { toast } from '../utils/toast.js';
import { capitalize, onEnter } from '../utils/utils.js';

/** NameInputRow: Creates an editable name row with props: onChange, onClick, name, ti
 * @param {{onChange: Function, onClick: Function, name: string, ti: number}} props Requires keys: onChange, onClick, name, ti. onChange is a function that updates the source of the display value
 *                      with the new inputted value. onClick is a function that deletes the item when called. name is the display value. ti is the tabindex value
 */
function NameInputRow(props) {
    return (
        <div className="l-row l-short-bottom">
            <input
                type="text"
                className="l-name"
                onChange={(e) => props.onChange(e.target.value)}
                value={props.name}
                tabIndex={props.ti}
                aria-label="added name"
                aria-description="Editable name in list"
            />
            <div className="l-input-button removeable clickable-overlay"
                onClick={props.onClick}
                onKeyDown={onEnter(props.onClick)}
                tabIndex={props.ti}
                aria-label="remove name"
                aria-description="Remove name from list"
            >
                &#x00D7;
            </div>
        </div>
    );
}

/*
    First main content panel, UI for collecting the names of everyone that will be
    splitting the receipt
*/
export class CollectNames extends React.Component {
    /**
        All props are stored in parent's state or computed from parent's base functions.
        list: The list this panel acts upon with create, update, delete, and clear.
        create: Specialized function that adds new entries to the list, takes a validation function and callback function
        update: Specialized function that updates a specific entry in the list, takes a validation function and callback function
        delete: Specialized function that removes a specific entry in the list, takes a callback function
        clear: Specialized function that empties the list, takes a callback function
        next: Switches the active panel to the next state/panel using the parent's stage variable stored within its state
        styleObject: Necessary for the carousel blur effect; When present is used to calculate its rotation and perspective, as well as disable
            any tab-able elements and inputs.
     * @param {{list: [], create: Function, update: Function, delete: Function, clear: Function, next: Function, styleObject: object?}} props
     */
    constructor(props) {
        super(props);
        this.input = React.createRef();
        /* Names are capitalized before being stored, cannot be empty */
        this.addItem = () => {
            this.props.create(() => capitalize(this.input.current.value),
                (value) => {
                    if(value.length === 0){
                        toast("Name cannot be empty");
                        return false;
                    }
                    /* 36 character limit for names */
                    if(value.length > 34){
                        toast("Name cannot exceed 34 characters")
                        return false;
                    }
                    return true;
                },
                () => {
                    this.input.current.value = "";
                    this.input.current.focus();
                });
        }
    }

    /* Used for determining tabindex, when panel is inactive, disable tabbing on those elements */
    disable() {
        return this.props.styleObject ? -1 : 0;
    }

    render() {
        const names = this.props.list.map((item, index) => (
            <NameInputRow
                name={item}
                onChange={(value) => this.props.update(index, () => capitalize(value), (value) => {
                    if(value.length > 34){
                        toast("Name cannot exceed 34 characters")
                        return false;
                    }
                    return true;
                })}
                onClick={() => this.props.delete(index)}
                key={index}
                ti={this.disable()}
            />
        ));
        return (
            <div id={this.props.styleObject ? "collect-names" : ""} className="l-main-panel" style={this.props.styleObject ? this.props.styleObject : {}}>
                <label for="stage-1-focus"><h2>Add everyone paying</h2></label>
                <div className="l-row l-top-gap">
                    <input
                        id="stage-1-focus"
                        type="text"
                        placeholder="Enter a name"
                        className="l-main-input"
                        ref={this.input}
                        onKeyDown={onEnter(this.addItem)}
                        tabIndex={this.disable()}
                    />
                    <div
                        className="l-input-button add clickable-overlay"
                        onKeyDown={onEnter(this.addItem)}
                        onClick={this.addItem}
                        tabIndex={this.disable()}
                        aria-label="add name"
                        aria-description="Add name to list"
                    >+</div>
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
