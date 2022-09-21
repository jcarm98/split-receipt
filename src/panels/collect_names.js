import React from 'react';

import { capitalize, onEnter } from '../utils/utils.js';

/** NameInputRow: Creates an editable name row with props: onChange, onClick, name, ti
 * @param {{onChange: Function, onClick: Function, name: string, ti: number}} props Requires keys: onChange, onClick, name, ti. onChange is a function that updates the source of the display value
 *                      with the new inputted value. onClick is a function that deletes the item when called. name is the display value. ti is the tabindex value
 */
function NameInputRow(props) {
    return (
        <div class="l-row l-short-bottom">
            <input
                type="text"
                class="l-name"
                onChange={(e) => props.onChange(e.target.value)}
                value={props.name}
                tabIndex={props.ti}
            />
            <div class="l-input-button removeable clickable-overlay"
                onClick={props.onClick}
                onKeyDown={onEnter(props.onClick)}
                tabIndex={props.ti}
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
    constructor(props) {
        super(props);
        this.input = React.createRef();
        /* Names are capitalized before being stored, cannot be empty */
        this.addItem = () => {
            this.props.create(() => capitalize(this.input.current.value),
                (value) => value.length !== 0,
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