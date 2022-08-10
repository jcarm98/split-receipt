import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function NameRow(props){
    return (
        <div
            className="nameRow">
            {props.name}
            <button
                className="minus"
                type="button"
                onClick={() => props.onClick()}>
                -
            </button>
        </div>
    );
}

class NameCollection extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            header: "SplitReceipt",
            name: "",
        };
    }

    onChange(e) {
        if (e.target.value.match("^.{0,12}$") != null) {
            this.setState({
                name: e.target.value,
            });
        }
    }

    clickPlus() {
        this.props.addName();
        this.setState({
            name: "",
        });
    }

    render() {
        const names = this.props.names.map((name, index) => (
            <NameRow
                name={name}
                key={index}
                onClick={() => this.props.removeName(index)}
            />
        ));
        return (
            <div className="container">
                <div id="nameCollection">
                    <header>{this.state.header}</header>
                    <label className="tip">Enter names.</label>
                    <br />
                    <input
                        className="nameInput"
                        type="text"
                        placeholder="Enter names"
                        ref={this.props.nameRef}
                        value={this.state.name}
                        onChange={(e) => this.onChange(e)}/>
                    <button
                        type="button"
                        className="plus"
                        onClick={() => this.clickPlus()} >
                        +
                </button>
                    <br />
                    {names}
                    <button
                        type="button"
                        className="next"
                        onClick={this.props.advance}>
                        Next
                </button>
                </div>
            </div>
        );
    }
}

function ItemRow(props) {
    return (
        <div
            className="itemRow">
            {props.item}
            <button
                type="button"
                className="minus"
                onClick={() => props.onClick()}>
                -
            </button>
            <aside
                className="price">
                ${props.price.toFixed(2)}
            </aside>
        </div>
    );
}

class ItemCollection extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            item: "",
            price: "",
        }
    }

    addItem() {
        this.props.addItem();
        this.setState({
            item: "",
            price: "",
        });
    }

    onChange(e) {
        if (e.target.value.match("^.{0,15}$") != null) {
            this.setState({
                item: e.target.value,
            });
        }
    }

    handleChangePrice(e) {
        if (e.target.value.match("^[0-9]*[.]?[0-9]{0,2}$") != null &&
            e.target.value.match("^.{0,7}$") != null) {
            this.setState({
                price: e.target.value,
            });
        }
    }

    render() {
        const items = this.props.items.map((item, index) => (
            <ItemRow
                item={item.item}
                price={parseFloat(item.price)}
                key={index}
                onClick={() => this.props.removeItem(index)}
            />
        ));
        return (
            <div className="container">
                <div id="itemCollection">
                    <label className="tip">Enter items and their prices.</label>
                    <br />
                    <input
                        type="text"
                        className="itemInput"
                        placeholder="Enter items"
                        ref={this.props.itemRef}
                        value={this.state.item}
                        onChange={(e) => this.onChange(e)}/>
                    <input
                        type="text"
                        className="priceInput"
                        placeholder="$__.__"
                        ref={this.props.priceRef}
                        value={this.state.price}
                        onChange={e => this.handleChangePrice(e)} />
                    <button
                        type="button"
                        className="plus"
                        onClick={() => this.addItem()} >
                        +
                    </button>
                    <br />
                    {items}
                    <button
                        type="button"
                        className="back"
                        onClick={this.props.retreat}>
                        Back
                </button>
                    <button
                        type="button"
                        className="next"
                        onClick={this.props.advance}>
                        Next
                </button>
                </div>
            </div>
        );
    }
}

function SelectableItemRow(props){
    const style = props.selected ?
        {
            fontWeight: "bold",
            color: "#000000",
            borderColor: "#000000",
        } :
        {};
    return (
        <div
            className="selectableItemRow">
            <div
                className="selectableItemRowButton"
                style={style}
                onClick={() => props.onClick()}>
                <label className="item">{props.item}</label>
                <aside
                    className="price">
                    ${props.price.toFixed(2)}
                </aside>
            </div>
        </div>
    );
}

function SelectableNameRow(props) {
    return (
        <div
            className="selectableNameRow"
            onClick={props.onChange}>
            <input
                type="checkbox"
                className="selectableNameRowButton"
                checked={props.checked}
                readOnly
            />
            <label className="name">{props.name}</label>
        </div>
    );
}

class SharedRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: false,
        }
    }

    toggleHidden() {
        this.setState({
            hidden: !this.state.hidden,
        });
    }

    render() {
        const names = this.props.names.map((name, index) => (
            <div
                className="nameSubRow"
                style={{ display: this.state.hidden ? "none" : "block" }}
                key={index}>
                {name}
            </div>
        ));
        return (
            <div>
                <div
                    className="sharedRow"
                    onClick={() => this.toggleHidden()}>
                    {this.props.item}
                    <button
                        type="button"
                        className="minus"
                        onClick={() => this.props.onClick()}>
                        -
                    </button>
                    <aside
                        className="price">
                        ${this.props.price.toFixed(2)}
                    </aside>
                </div>
                {names}
            </div>
        );
    }
}

class EstablishRelation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: "",
        };
    }

    selectItem(i) {
        if (i === this.state.selectedItem) {
            this.setState({
                selectedItem: "",
            });
            return;
        }
        this.setState({
            selectedItem: i,
        }, () => {
            if (this.state.selectedItem !== "" && this.state.divHeight === -1) {
                 const height = document.getElementById("nameList").clientHeight;
                 this.setState({
                    divHeight: height,
                 });
            }
        });
    }

    confirm() {
        this.props.addShared(this.state.selectedItem);
        if (this.props.items.length < 1 || this.state.selectedItem >= this.props.items.length)
            this.setState({
                selectedItem: "",
            });
    }

    componentDidMount() {
    }

    render() {
        let value = this.state.selectedItem != null ? this.state.selectedItem : 0;
        const names = this.props.names.map((name, index) => (
            <SelectableNameRow
                name={name}
                key={index}
                onChange={() => this.props.toggleName(this.state.selectedItem, index)}
                checked={this.props.getFlag(value, index)}
            />
        ));
        const items = this.props.items.map((item, index) => (
            <SelectableItemRow
                item={item.item}
                price={parseFloat(item.price)}
                key={index}
                selected={this.state.selectedItem === index}
                onClick={() => this.selectItem(index)}
            />
        ));
        const shared = this.props.sharedList.map((element, index) => (
            <SharedRow
                item={element.item}
                price={parseFloat(element.price)}
                names={element.names}
                key={index}
                onClick={() => this.props.removeShared(index)}
            />
        ));
        return (
            <div className="container">
                <div id="establishRelation">
                    <div id="top">
                        <div id="itemList"
                            style={{
                                width: this.state.selectedItem === "" ? "100%" : "50%",
                                display: this.props.items.length !== 0 ? "inline-block" : "none",
                            }}>
                            <label id="itemListTip" className="tip">Pick an item.</label>
                            <br />
                            {items}
                        </div>
                        <div id="nameList"
                            style={{
                                width: "50%",
                                display: this.state.selectedItem === "" ? "none" : "inline-block",
                            }}>
                            <label id="nameListTip" className="tip">Pick everyone that's paying.</label>
                            {names}
                            <button
                                type="button"
                                className="all"
                                onClick={() => this.props.allNames(this.state.selectedItem)}>
                                All
                        </button>
                        <button
                                type="button"
                                className="none"
                                onClick={() => this.props.clearSelectedNames(this.state.selectedItem)}>
                                None
                        </button>
                            <button
                                type="button"
                                className="confirm"
                                onClick={() => this.confirm()}>
                                Confirm
                        </button>
                        </div>
                    </div>
                    <div id="bottom">
                        {shared}
                        <button
                            type="button"
                            className="back"
                            onClick={this.props.retreat}>
                            Back
                    </button>
                        <button
                            type="button"
                            className="next"
                            onClick={this.props.advance}>
                            Next
                </button>
                    </div>
                </div>
            </div>
        );
    }
}

class FinalRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: false,
        };
    }

    toggleHidden() {
        this.setState({
            hidden: !this.state.hidden,
        });
    }

    render() {
        const items = this.props.items.map((item, index) => (
            <aside
                className="itemSubRow"
                style={{ display: this.state.hidden ? "none" : "block" }}
                key={index}>
                {item.item}
                <aside
                    className="partialAmount">
                    ${item.price.toFixed(2)}
                </aside>
            </aside>
        ));
        return (
            <div>
                <div
                    className="finalRow"
                    onClick={() => this.toggleHidden()}>
                    {this.props.name}
                    <aside
                        className="totalAmount">
                        ${this.props.amount.toFixed(2)}
                    </aside>
                </div>
                {items}
            </div>
        );
    }
}

class CalculateTax extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tax: 8,
        };
    }

    handleChangeTax(e) {
        if (e.target.value.match("^[0-9]*[.]?[0-9]*$") != null &&
            e.target.value.match("^.{0,5}$") != null) {
            this.setState({
                tax: e.target.value,
            });
        }
    }

    render() {
        let total = 0.0;
        for (let i = 0; i < this.props.finalList.length; ++i) {
            total += this.props.finalList[i].amount * (1.0 + (parseFloat(
                this.state.tax !== "" ? this.state.tax : 0
            ) / 100.0));
        }
        const rows = this.props.finalList.map((final, index) => (
            <FinalRow
                name={final.name}
                amount={final.amount * (1.0 + (parseFloat(
                    this.state.tax !== "" ? this.state.tax : 0
                ) / 100.0))}
                key={index}
                items={final.items}
            />
        ));
        return (
            <div
                className="container">
                <div id="calculateTax">
                    {rows}
                    <aside
                        style={{ float: "right" }}>
                        Tax:&nbsp;
                    <input
                            className="tax"
                            type="text"
                            value={this.state.tax}
                            onChange={e => this.handleChangeTax(e)}
                        />%
                </aside>
                    <br /><br />
                    <aside
                        style={{ float: "right" }}>
                        Total: ${total.toFixed(2)}
                    </aside>
                    <br />
                    <button
                        type="button"
                        className="back"
                        onClick={this.props.retreat}>
                        Back
                </button>
                </div>
            </div>
        );
    }
}

class Split extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            screen: 1,
            names: [],
            items: [],
            checkboxFlags: null,
            sharedList: [],
            finalList: [],
        };
        this.nameRef = React.createRef();
        this.itemRef = React.createRef();
        this.priceRef = React.createRef();
    }

    initFlags() {
        let flags = new Array(this.state.items.length);
        for (let i = 0; i < flags.length; ++i) {
            flags[i] = new Array(this.state.names.length);
            for (let j = 0; j < flags[0].length; ++j) {
                flags[i][j] = false;
            }
        }
        this.setState({
            checkboxFlags: flags,
        });
    }

    calculate() {
        const shared = this.state.sharedList;
        const names = this.state.names;

        let amount = new Array(names.length);
        for (let i = 0; i < amount.length; ++i) {
            amount[i] = 0.0;
        }

        let items = new Array(names.length);
        for (let i = 0; i < items.length; ++i) {
            items[i] = [];
        }

        for (let i = 0; i < shared.length; ++i) {
            for (let j = 0; j < shared[i].flags.length; ++j) {
                if (shared[i].flags[j]) {
                    amount[j] += parseFloat(shared[i].price) / (shared[i].names.length);
                }
            }
        }

        for (let i = 0; i < names.length; ++i) {
            for (let j = 0; j < shared.length; ++j) {
                if (shared[j].flags[i]) {
                    items[i].push({
                        item: shared[j].item,
                        price: parseFloat(shared[j].price) / (shared[j].names.length),
                    });
                }
            }
        }



        let finalList = new Array(names.length);
        for (let i = 0; i < finalList.length; ++i) {
            finalList[i] = {
                name: names[i],
                amount: amount[i],
                items: items[i],
            };
        }
        this.setState({
            finalList: finalList,
        });
    }

    advance() {
        if (this.state.screen > 3)
            return;
        if (this.state.screen === 1 && this.state.names.length < 2)
            return;
        if (this.state.screen === 2 && this.state.items.length < 1)
            return;
        if (this.state.screen === 3 && this.state.items.length > 0)
            return;

        if (this.state.screen === 1)
            this.setState({
                names: this.state.names.sort(
                    (a, b) => {
                        if (a < b) { return -1; }
                        if (a > b) { return 1; }
                        return 0;
                    }),
            });
        if (this.state.screen === 2)
            this.initFlags();
        if (this.state.screen === 3)
            this.calculate();
        this.setState({
            screen: this.state.screen + 1,
        });

    }

    retreat() {
        if (this.state.screen <= 0)
            return;
        this.setState({
            screen: this.state.screen - 1,
        });
    }

    addName() {
        if (!this.nameRef.current.value)
            return;
        const names = this.state.names;
        this.setState({
            names: names.concat([
                this.nameRef.current.value,
            ]),
        });
    }

    removeName(i) {
        this.state.names.splice(i, 1);
        this.setState({
            names: this.state.names,
        });
    }

    addItem() {
        if (!this.itemRef.current.value || !this.priceRef.current.value)
            return;
        if (this.priceRef.current.value.match("^[0-9]*[.]?[0-9]{0,2}$") == null) {
            alert("Please enter price as shown on your receipt.");
            return;
        }
            
        const items = this.state.items;
        this.setState({
            items: items.concat([{
                item: this.itemRef.current.value,
                price: this.priceRef.current.value,
            }]),
        });
    }

    removeItem(i) {
        this.state.items.splice(i, 1);
        this.setState({
            items: this.state.items,
        });
    }

    toggleName(i, j) {
        if (i === "" || this.state.checkboxFlags === null)
            return;
        const flags = this.state.checkboxFlags;
        flags[i][j] = !flags[i][j];
        this.setState({
            checkboxFlags: flags,
        });
    }

    allNames(i) {
        if (i === "")
            return;
        const flags = this.state.checkboxFlags;
        if (i >= flags.length)
            return;
        for (let j = 0; j < flags[i].length; ++j) {
            flags[i][j] = true;
        }
        this.setState({
            checkboxFlags: flags,
        });
    }

    clearSelectedNames(i) {
        if (i === "")
            return;
        const flags = this.state.checkboxFlags;
        for (let j = 0; j < flags[i].length; ++j) {
            flags[i][j] = false;
        }
        this.setState({
            checkboxFlags: flags,
        });
    }

    getFlag(i, j) {
        if (i === "")
            return false;
        const flags = this.state.checkboxFlags;
        if (i >= flags.length ||
            j >= flags[i].length)
            return false;
        return this.state.checkboxFlags[i][j];
    }

    addShared(i) {
        if (i === "")
            return;
        const flags = this.state.checkboxFlags;
        
        let check = false;
        for (let j = 0; j < flags[i].length; ++j)
            if (flags[i][j])
                check = true;
        if (check === false)
            return;

        const items = this.state.items;
        const names = this.state.names;
        let filteredNames = [];
        for (let j = 0; j < names.length; ++j) {
            if (flags[i][j]) {
                filteredNames.push(names[j]);
            }
        }

        let sharedElement = {
            item: items[i].item,
            price: items[i].price,
            names: filteredNames,
            flags: flags[i],
        };

        items.splice(i, 1);
        flags.splice(i, 1);

        const sharedList = this.state.sharedList;
        this.setState({
            items: items,
            checkboxFlags: flags,
            sharedList: sharedList.concat([
                sharedElement,
            ]),
        });
    }

    removeShared(i) {
        const removed = this.state.sharedList[i];

        const items = this.state.items.concat([{
            item: removed.item,
            price: removed.price,
        }]);

        this.state.sharedList.splice(i, 1);

        let flags = new Array(this.state.names.length);
        for (let i = 0; i < flags.length; ++i) {
            flags[i] = false;
        }

        const newFlags = this.state.checkboxFlags.concat([
            flags,
        ]);
        this.setState({
            items: items,
            checkboxFlags: newFlags,
            sharedList: this.state.sharedList,
        });
    }

    render() {
        if (this.state.screen === 1)
            return (
                <NameCollection
                    addName={() => this.addName()}
                    removeName={(i) => this.removeName(i)}
                    names={this.state.names}
                    nameRef={this.nameRef}
                    advance={() => this.advance()}
                />
            );
        else if (this.state.screen === 2)
            return (
                <ItemCollection
                    addItem={() => this.addItem()}
                    removeItem={(i) => this.removeItem(i)}
                    items={this.state.items}
                    itemRef={this.itemRef}
                    priceRef={this.priceRef}
                    retreat={() => this.retreat()}
                    advance={() => this.advance()}
                />
            );
        else if (this.state.screen === 3)
            return (
                <EstablishRelation
                    names={this.state.names}
                    items={this.state.items}
                    getFlag={(i, j) => this.getFlag(i, j)}
                    sharedList={this.state.sharedList}
                    addShared={(i) => this.addShared(i)}
                    removeShared={(i) => this.removeShared(i)}
                    toggleName={(i, j) => this.toggleName(i, j)}
                    allNames={(i) => this.allNames(i)}
                    clearSelectedNames={(i) => this.clearSelectedNames(i)}
                    retreat={() => this.retreat()}
                    advance={() => this.advance()}
                />
            );
        else if (this.state.screen === 4)
            return (
                <CalculateTax
                    finalList={this.state.finalList}
                    retreat={() => this.retreat()}
                />
            );
        else
            return;
    }
}


ReactDOM.render(
    <Split id="split" />,
    document.getElementById('root')
);


//const container = document.querySelector('#split');
//ReactDOM.render(<Split />, container);