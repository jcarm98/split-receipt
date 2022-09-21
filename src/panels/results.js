import React from 'react';

import { toDollars, toFloat } from '../utils/utils.js';

/**
    person: name, amount
    list: [{item, amount}]
*/
/** ResultRow: Creates a grouped row that shows what items each person is paying for.
 * @param {{person: {name: string, amount: string}, list: Array{item: string, amount: string}}} props 
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

/*
    The fourth and final main content panel, UI for viewing who pays what amount, with the ability
    to set the tax and tip.
*/
export class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tax: "8.00",
            tip: "0"
        };
    }

    /**
        Validate tax
        8.00
        0.1
        1
     */
    taxOnChange(e) {
        let value = e.target.value;
        if (String(value).match("^[0-9]*[.]?[0-9]{0,2}$") === null) { }
        else {
            this.setState({ tax: value });
        }
    }
    /**
        Validate tip
        $8.00
        0.1
        1
    */
    tipOnChange(e, percentMode, total) {
        if (percentMode) {
            let converted = toFloat(e.target.value) / 100 * total;
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

    /* Used for determining tabindex, when panel is inactive, disable tabbing on those elements */
    disable() {
        return this.props.styleObject ? -1 : 0;
    }

    render() {
        let items = {};
        /* Add each item to each person that is mapped to that item */
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
        /* Create the result row with the total amount and person it belongs to */
        let rows = this.props.names.map((n, index) => {
            if (n in items && items[n])
                amounts[n] = (items[n].map(i => i.amount).reduce((prev, curr) => prev + curr, 0)) * (1 + toFloat(this.state.tax ? this.state.tax : 0) / 100) + (toFloat(this.state.tip) / this.props.names.length);
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
            <div id={this.props.styleObject ? "results" : ""} className="l-main-panel" style={this.props.styleObject ? this.props.styleObject : {}}>
                <div className="top-gap l-result-input-row">
                    <div className="l-result-input-wrapper">
                        Tax:&nbsp;
                        <input
                            id="stage-4-focus"
                            type="text"
                            placeholder="8.00"
                            className="l-result-input l-padding-no-button"
                            value={this.state.tax}
                            onChange={(e) => this.taxOnChange(e)}
                            tabIndex={this.disable()}
                        />
                        &nbsp;% = {`$${toDollars(subtotal * (this.state.tax / 100))}`}
                    </div>
                    <div className="l-result-input-wrapper">
                        Tip:&nbsp;$&nbsp;
                        <input
                            type="text"
                            placeholder="$5.00"
                            className="l-result-input l-padding-no-button"
                            onChange={(e) => this.tipOnChange(e, false, subtotal)}
                            value={this.state.tip}
                            tabIndex={this.disable()}
                        />&nbsp;= %&nbsp;{this.toPercent(this.state.tip, subtotal)}
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