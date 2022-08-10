var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//import React from 'react';
//import ReactDOM from 'react-dom';
//import './index.css';

function NameRow(props) {
    return React.createElement(
        "div",
        {
            className: "nameRow" },
        props.name,
        React.createElement(
            "button",
            {
                className: "minus",
                type: "button",
                onClick: function onClick() {
                    return props.onClick();
                } },
            "-"
        )
    );
}

var NameCollection = function (_React$Component) {
    _inherits(NameCollection, _React$Component);

    function NameCollection(props) {
        _classCallCheck(this, NameCollection);

        var _this = _possibleConstructorReturn(this, (NameCollection.__proto__ || Object.getPrototypeOf(NameCollection)).call(this, props));

        _this.state = {
            header: "SplitReceipt.app",
            name: ""
        };
        return _this;
    }

    _createClass(NameCollection, [{
        key: "onChange",
        value: function onChange(e) {
            if (e.target.value.match("^.{0,12}$") != null) {
                this.setState({
                    name: e.target.value
                });
            }
        }
    }, {
        key: "clickPlus",
        value: function clickPlus() {
            this.props.addName();
            this.setState({
                name: ""
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var names = this.props.names.map(function (name, index) {
                return React.createElement(NameRow, {
                    name: name,
                    key: index,
                    onClick: function onClick() {
                        return _this2.props.removeName(index);
                    }
                });
            });
            return React.createElement(
                "div",
                { className: "container" },
                React.createElement(
                    "div",
                    { id: "nameCollection" },
                    React.createElement(
                        "header",
                        null,
                        this.state.header
                    ),
                    React.createElement(
                        "label",
                        { className: "tip" },
                        "Enter names."
                    ),
                    React.createElement("br", null),
                    React.createElement("input", {
                        className: "nameInput",
                        type: "text",
                        placeholder: "Enter names",
                        ref: this.props.nameRef,
                        value: this.state.name,
                        onChange: function onChange(e) {
                            return _this2.onChange(e);
                        } }),
                    React.createElement(
                        "button",
                        {
                            type: "button",
                            className: "plus",
                            onClick: function onClick() {
                                return _this2.clickPlus();
                            } },
                        "+"
                    ),
                    React.createElement("br", null),
                    names,
                    React.createElement(
                        "button",
                        {
                            type: "button",
                            className: "next",
                            onClick: this.props.advance },
                        "Next"
                    )
                )
            );
        }
    }]);

    return NameCollection;
}(React.Component);

function ItemRow(props) {
    return React.createElement(
        "div",
        {
            className: "itemRow" },
        props.item,
        React.createElement(
            "button",
            {
                type: "button",
                className: "minus",
                onClick: function onClick() {
                    return props.onClick();
                } },
            "-"
        ),
        React.createElement(
            "aside",
            {
                className: "price" },
            "$",
            props.price.toFixed(2)
        )
    );
}

var ItemCollection = function (_React$Component2) {
    _inherits(ItemCollection, _React$Component2);

    function ItemCollection(props) {
        _classCallCheck(this, ItemCollection);

        var _this3 = _possibleConstructorReturn(this, (ItemCollection.__proto__ || Object.getPrototypeOf(ItemCollection)).call(this, props));

        _this3.state = {
            item: "",
            price: ""
        };
        return _this3;
    }

    _createClass(ItemCollection, [{
        key: "addItem",
        value: function addItem() {
            this.props.addItem();
            this.setState({
                item: "",
                price: ""
            });
        }
    }, {
        key: "onChange",
        value: function onChange(e) {
            if (e.target.value.match("^.{0,15}$") != null) {
                this.setState({
                    item: e.target.value
                });
            }
        }
    }, {
        key: "handleChangePrice",
        value: function handleChangePrice(e) {
            if (e.target.value.match("^[0-9]*[.]?[0-9]{0,2}$") != null && e.target.value.match("^.{0,7}$") != null) {
                this.setState({
                    price: e.target.value
                });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this4 = this;

            var items = this.props.items.map(function (item, index) {
                return React.createElement(ItemRow, {
                    item: item.item,
                    price: parseFloat(item.price),
                    key: index,
                    onClick: function onClick() {
                        return _this4.props.removeItem(index);
                    }
                });
            });
            return React.createElement(
                "div",
                { className: "container" },
                React.createElement(
                    "div",
                    { id: "itemCollection" },
                    React.createElement(
                        "label",
                        { className: "tip" },
                        "Enter items and their prices."
                    ),
                    React.createElement("br", null),
                    React.createElement("input", {
                        type: "text",
                        className: "itemInput",
                        placeholder: "Enter items",
                        ref: this.props.itemRef,
                        value: this.state.item,
                        onChange: function onChange(e) {
                            return _this4.onChange(e);
                        } }),
                    React.createElement("input", {
                        type: "text",
                        className: "priceInput",
                        placeholder: "$__.__",
                        ref: this.props.priceRef,
                        value: this.state.price,
                        onChange: function onChange(e) {
                            return _this4.handleChangePrice(e);
                        } }),
                    React.createElement(
                        "button",
                        {
                            type: "button",
                            className: "plus",
                            onClick: function onClick() {
                                return _this4.addItem();
                            } },
                        "+"
                    ),
                    React.createElement("br", null),
                    items,
                    React.createElement(
                        "button",
                        {
                            type: "button",
                            className: "back",
                            onClick: this.props.retreat },
                        "Back"
                    ),
                    React.createElement(
                        "button",
                        {
                            type: "button",
                            className: "next",
                            onClick: this.props.advance },
                        "Next"
                    )
                )
            );
        }
    }]);

    return ItemCollection;
}(React.Component);

function SelectableItemRow(props) {
    var style = props.selected ? {
        fontWeight: "bold",
        color: "#000000",
        borderColor: "#000000"
    } : {};
    return React.createElement(
        "div",
        {
            className: "selectableItemRow" },
        React.createElement(
            "div",
            {
                className: "selectableItemRowButton",
                style: style,
                onClick: function onClick() {
                    return props.onClick();
                } },
            React.createElement(
                "label",
                { className: "item" },
                props.item
            ),
            React.createElement(
                "aside",
                {
                    className: "price" },
                "$",
                props.price.toFixed(2)
            )
        )
    );
}

function SelectableNameRow(props) {
    return React.createElement(
        "div",
        {
            className: "selectableNameRow",
            onClick: props.onChange },
        React.createElement("input", {
            type: "checkbox",
            className: "selectableNameRowButton",
            checked: props.checked,
            readOnly: true
        }),
        React.createElement(
            "label",
            { className: "name" },
            props.name
        )
    );
}

var SharedRow = function (_React$Component3) {
    _inherits(SharedRow, _React$Component3);

    function SharedRow(props) {
        _classCallCheck(this, SharedRow);

        var _this5 = _possibleConstructorReturn(this, (SharedRow.__proto__ || Object.getPrototypeOf(SharedRow)).call(this, props));

        _this5.state = {
            hidden: false
        };
        return _this5;
    }

    _createClass(SharedRow, [{
        key: "toggleHidden",
        value: function toggleHidden() {
            this.setState({
                hidden: !this.state.hidden
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this6 = this;

            var names = this.props.names.map(function (name, index) {
                return React.createElement(
                    "div",
                    {
                        className: "nameSubRow",
                        style: { display: _this6.state.hidden ? "none" : "block" },
                        key: index },
                    name
                );
            });
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    {
                        className: "sharedRow",
                        onClick: function onClick() {
                            return _this6.toggleHidden();
                        } },
                    this.props.item,
                    React.createElement(
                        "button",
                        {
                            type: "button",
                            className: "minus",
                            onClick: function onClick() {
                                return _this6.props.onClick();
                            } },
                        "-"
                    ),
                    React.createElement(
                        "aside",
                        {
                            className: "price" },
                        "$",
                        this.props.price.toFixed(2)
                    )
                ),
                names
            );
        }
    }]);

    return SharedRow;
}(React.Component);

var EstablishRelation = function (_React$Component4) {
    _inherits(EstablishRelation, _React$Component4);

    function EstablishRelation(props) {
        _classCallCheck(this, EstablishRelation);

        var _this7 = _possibleConstructorReturn(this, (EstablishRelation.__proto__ || Object.getPrototypeOf(EstablishRelation)).call(this, props));

        _this7.state = {
            selectedItem: ""
        };
        return _this7;
    }

    _createClass(EstablishRelation, [{
        key: "selectItem",
        value: function selectItem(i) {
            var _this8 = this;

            if (i === this.state.selectedItem) {
                this.setState({
                    selectedItem: ""
                });
                return;
            }
            this.setState({
                selectedItem: i
            }, function () {
                if (_this8.state.selectedItem !== "" && _this8.state.divHeight === -1) {
                    var height = document.getElementById("nameList").clientHeight;
                    _this8.setState({
                        divHeight: height
                    });
                }
            });
        }
    }, {
        key: "confirm",
        value: function confirm() {
            this.props.addShared(this.state.selectedItem);
            if (this.props.items.length < 1 || this.state.selectedItem >= this.props.items.length) this.setState({
                selectedItem: ""
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {}
    }, {
        key: "render",
        value: function render() {
            var _this9 = this;

            var value = this.state.selectedItem != null ? this.state.selectedItem : 0;
            var names = this.props.names.map(function (name, index) {
                return React.createElement(SelectableNameRow, {
                    name: name,
                    key: index,
                    onChange: function onChange() {
                        return _this9.props.toggleName(_this9.state.selectedItem, index);
                    },
                    checked: _this9.props.getFlag(value, index)
                });
            });
            var items = this.props.items.map(function (item, index) {
                return React.createElement(SelectableItemRow, {
                    item: item.item,
                    price: parseFloat(item.price),
                    key: index,
                    selected: _this9.state.selectedItem === index,
                    onClick: function onClick() {
                        return _this9.selectItem(index);
                    }
                });
            });
            var shared = this.props.sharedList.map(function (element, index) {
                return React.createElement(SharedRow, {
                    item: element.item,
                    price: parseFloat(element.price),
                    names: element.names,
                    key: index,
                    onClick: function onClick() {
                        return _this9.props.removeShared(index);
                    }
                });
            });
            return React.createElement(
                "div",
                { className: "container" },
                React.createElement(
                    "div",
                    { id: "establishRelation" },
                    React.createElement(
                        "div",
                        { id: "top" },
                        React.createElement(
                            "div",
                            { id: "itemList",
                                style: {
                                    width: this.state.selectedItem === "" ? "100%" : "50%",
                                    display: this.props.items.length !== 0 ? "inline-block" : "none"
                                } },
                            React.createElement(
                                "label",
                                { id: "itemListTip", className: "tip" },
                                "Pick an item."
                            ),
                            React.createElement("br", null),
                            items
                        ),
                        React.createElement(
                            "div",
                            { id: "nameList",
                                style: {
                                    width: "50%",
                                    display: this.state.selectedItem === "" ? "none" : "inline-block"
                                } },
                            React.createElement(
                                "label",
                                { id: "nameListTip", className: "tip" },
                                "Pick everyone that's paying."
                            ),
                            names,
                            React.createElement(
                                "button",
                                {
                                    type: "button",
                                    className: "all",
                                    onClick: function onClick() {
                                        return _this9.props.allNames(_this9.state.selectedItem);
                                    } },
                                "All"
                            ),
                            React.createElement(
                                "button",
                                {
                                    type: "button",
                                    className: "none",
                                    onClick: function onClick() {
                                        return _this9.props.clearSelectedNames(_this9.state.selectedItem);
                                    } },
                                "None"
                            ),
                            React.createElement(
                                "button",
                                {
                                    type: "button",
                                    className: "confirm",
                                    onClick: function onClick() {
                                        return _this9.confirm();
                                    } },
                                "Confirm"
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { id: "bottom" },
                        shared,
                        React.createElement(
                            "button",
                            {
                                type: "button",
                                className: "back",
                                onClick: this.props.retreat },
                            "Back"
                        ),
                        React.createElement(
                            "button",
                            {
                                type: "button",
                                className: "next",
                                onClick: this.props.advance },
                            "Next"
                        )
                    )
                )
            );
        }
    }]);

    return EstablishRelation;
}(React.Component);

var FinalRow = function (_React$Component5) {
    _inherits(FinalRow, _React$Component5);

    function FinalRow(props) {
        _classCallCheck(this, FinalRow);

        var _this10 = _possibleConstructorReturn(this, (FinalRow.__proto__ || Object.getPrototypeOf(FinalRow)).call(this, props));

        _this10.state = {
            hidden: false
        };
        return _this10;
    }

    _createClass(FinalRow, [{
        key: "toggleHidden",
        value: function toggleHidden() {
            this.setState({
                hidden: !this.state.hidden
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this11 = this;

            var items = this.props.items.map(function (item, index) {
                return React.createElement(
                    "aside",
                    {
                        className: "itemSubRow",
                        style: { display: _this11.state.hidden ? "none" : "block" },
                        key: index },
                    item.item,
                    React.createElement(
                        "aside",
                        {
                            className: "partialAmount" },
                        "$",
                        item.price.toFixed(2)
                    )
                );
            });
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    {
                        className: "finalRow",
                        onClick: function onClick() {
                            return _this11.toggleHidden();
                        } },
                    this.props.name,
                    React.createElement(
                        "aside",
                        {
                            className: "totalAmount" },
                        "$",
                        this.props.amount.toFixed(2)
                    )
                ),
                items
            );
        }
    }]);

    return FinalRow;
}(React.Component);

var CalculateTax = function (_React$Component6) {
    _inherits(CalculateTax, _React$Component6);

    function CalculateTax(props) {
        _classCallCheck(this, CalculateTax);

        var _this12 = _possibleConstructorReturn(this, (CalculateTax.__proto__ || Object.getPrototypeOf(CalculateTax)).call(this, props));

        _this12.state = {
            tax: 8
        };
        return _this12;
    }

    _createClass(CalculateTax, [{
        key: "handleChangeTax",
        value: function handleChangeTax(e) {
            if (e.target.value.match("^[0-9]*[.]?[0-9]*$") != null && e.target.value.match("^.{0,5}$") != null) {
                this.setState({
                    tax: e.target.value
                });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this13 = this;

            var total = 0.0;
            for (var i = 0; i < this.props.finalList.length; ++i) {
                total += this.props.finalList[i].amount * (1.0 + parseFloat(this.state.tax !== "" ? this.state.tax : 0) / 100.0);
            }
            var rows = this.props.finalList.map(function (final, index) {
                return React.createElement(FinalRow, {
                    name: final.name,
                    amount: final.amount * (1.0 + parseFloat(_this13.state.tax !== "" ? _this13.state.tax : 0) / 100.0),
                    key: index,
                    items: final.items
                });
            });
            return React.createElement(
                "div",
                {
                    className: "container" },
                React.createElement(
                    "div",
                    { id: "calculateTax" },
                    rows,
                    React.createElement(
                        "aside",
                        {
                            style: { float: "right" } },
                        "Tax:\xA0",
                        React.createElement("input", {
                            className: "tax",
                            type: "text",
                            value: this.state.tax,
                            onChange: function onChange(e) {
                                return _this13.handleChangeTax(e);
                            }
                        }),
                        "%"
                    ),
                    React.createElement("br", null),
                    React.createElement("br", null),
                    React.createElement(
                        "aside",
                        {
                            style: { float: "right" } },
                        "Total: $",
                        total.toFixed(2)
                    ),
                    React.createElement("br", null),
                    React.createElement(
                        "button",
                        {
                            type: "button",
                            className: "back",
                            onClick: this.props.retreat },
                        "Back"
                    )
                )
            );
        }
    }]);

    return CalculateTax;
}(React.Component);

var Split = function (_React$Component7) {
    _inherits(Split, _React$Component7);

    function Split(props) {
        _classCallCheck(this, Split);

        var _this14 = _possibleConstructorReturn(this, (Split.__proto__ || Object.getPrototypeOf(Split)).call(this, props));

        _this14.state = {
            screen: 1,
            names: [],
            items: [],
            checkboxFlags: null,
            sharedList: [],
            finalList: []
        };
        _this14.nameRef = React.createRef();
        _this14.itemRef = React.createRef();
        _this14.priceRef = React.createRef();
        return _this14;
    }

    _createClass(Split, [{
        key: "initFlags",
        value: function initFlags() {
            var flags = new Array(this.state.items.length);
            for (var i = 0; i < flags.length; ++i) {
                flags[i] = new Array(this.state.names.length);
                for (var j = 0; j < flags[0].length; ++j) {
                    flags[i][j] = false;
                }
            }
            this.setState({
                checkboxFlags: flags
            });
        }
    }, {
        key: "calculate",
        value: function calculate() {
            var shared = this.state.sharedList;
            var names = this.state.names;

            var amount = new Array(names.length);
            for (var i = 0; i < amount.length; ++i) {
                amount[i] = 0.0;
            }

            var items = new Array(names.length);
            for (var _i = 0; _i < items.length; ++_i) {
                items[_i] = [];
            }

            for (var _i2 = 0; _i2 < shared.length; ++_i2) {
                for (var j = 0; j < shared[_i2].flags.length; ++j) {
                    if (shared[_i2].flags[j]) {
                        amount[j] += parseFloat(shared[_i2].price) / shared[_i2].names.length;
                    }
                }
            }

            for (var _i3 = 0; _i3 < names.length; ++_i3) {
                for (var _j = 0; _j < shared.length; ++_j) {
                    if (shared[_j].flags[_i3]) {
                        items[_i3].push({
                            item: shared[_j].item,
                            price: parseFloat(shared[_j].price) / shared[_j].names.length
                        });
                    }
                }
            }

            var finalList = new Array(names.length);
            for (var _i4 = 0; _i4 < finalList.length; ++_i4) {
                finalList[_i4] = {
                    name: names[_i4],
                    amount: amount[_i4],
                    items: items[_i4]
                };
            }
            this.setState({
                finalList: finalList
            });
        }
    }, {
        key: "advance",
        value: function advance() {
            if (this.state.screen > 3) return;
            if (this.state.screen === 1 && this.state.names.length < 2) return;
            if (this.state.screen === 2 && this.state.items.length < 1) return;
            if (this.state.screen === 3 && this.state.items.length > 0) return;

            if (this.state.screen === 1) this.setState({
                names: this.state.names.sort(function (a, b) {
                    if (a < b) {
                        return -1;
                    }
                    if (a > b) {
                        return 1;
                    }
                    return 0;
                })
            });
            if (this.state.screen === 2) this.initFlags();
            if (this.state.screen === 3) this.calculate();
            this.setState({
                screen: this.state.screen + 1
            });
        }
    }, {
        key: "retreat",
        value: function retreat() {
            if (this.state.screen <= 0) return;
            this.setState({
                screen: this.state.screen - 1
            });
        }
    }, {
        key: "addName",
        value: function addName() {
            if (!this.nameRef.current.value) return;
            var names = this.state.names;
            this.setState({
                names: names.concat([this.nameRef.current.value])
            });
        }
    }, {
        key: "removeName",
        value: function removeName(i) {
            this.state.names.splice(i, 1);
            this.setState({
                names: this.state.names
            });
        }
    }, {
        key: "addItem",
        value: function addItem() {
            if (!this.itemRef.current.value || !this.priceRef.current.value) return;
            if (this.priceRef.current.value.match("^[0-9]*[.]?[0-9]{0,2}$") == null) {
                alert("Please enter price as shown on your receipt.");
                return;
            }

            var items = this.state.items;
            this.setState({
                items: items.concat([{
                    item: this.itemRef.current.value,
                    price: this.priceRef.current.value
                }])
            });
        }
    }, {
        key: "removeItem",
        value: function removeItem(i) {
            this.state.items.splice(i, 1);
            this.setState({
                items: this.state.items
            });
        }
    }, {
        key: "toggleName",
        value: function toggleName(i, j) {
            if (i === "" || this.state.checkboxFlags === null) return;
            var flags = this.state.checkboxFlags;
            flags[i][j] = !flags[i][j];
            this.setState({
                checkboxFlags: flags
            });
        }
    }, {
        key: "allNames",
        value: function allNames(i) {
            if (i === "") return;
            var flags = this.state.checkboxFlags;
            if (i >= flags.length) return;
            for (var j = 0; j < flags[i].length; ++j) {
                flags[i][j] = true;
            }
            this.setState({
                checkboxFlags: flags
            });
        }
    }, {
        key: "clearSelectedNames",
        value: function clearSelectedNames(i) {
            if (i === "") return;
            var flags = this.state.checkboxFlags;
            for (var j = 0; j < flags[i].length; ++j) {
                flags[i][j] = false;
            }
            this.setState({
                checkboxFlags: flags
            });
        }
    }, {
        key: "getFlag",
        value: function getFlag(i, j) {
            if (i === "") return false;
            var flags = this.state.checkboxFlags;
            if (i >= flags.length || j >= flags[i].length) return false;
            return this.state.checkboxFlags[i][j];
        }
    }, {
        key: "addShared",
        value: function addShared(i) {
            if (i === "") return;
            var flags = this.state.checkboxFlags;

            var check = false;
            for (var j = 0; j < flags[i].length; ++j) {
                if (flags[i][j]) check = true;
            }if (check === false) return;

            var items = this.state.items;
            var names = this.state.names;
            var filteredNames = [];
            for (var _j2 = 0; _j2 < names.length; ++_j2) {
                if (flags[i][_j2]) {
                    filteredNames.push(names[_j2]);
                }
            }

            var sharedElement = {
                item: items[i].item,
                price: items[i].price,
                names: filteredNames,
                flags: flags[i]
            };

            items.splice(i, 1);
            flags.splice(i, 1);

            var sharedList = this.state.sharedList;
            this.setState({
                items: items,
                checkboxFlags: flags,
                sharedList: sharedList.concat([sharedElement])
            });
        }
    }, {
        key: "removeShared",
        value: function removeShared(i) {
            var removed = this.state.sharedList[i];

            var items = this.state.items.concat([{
                item: removed.item,
                price: removed.price
            }]);

            this.state.sharedList.splice(i, 1);

            var flags = new Array(this.state.names.length);
            for (var _i5 = 0; _i5 < flags.length; ++_i5) {
                flags[_i5] = false;
            }

            var newFlags = this.state.checkboxFlags.concat([flags]);
            this.setState({
                items: items,
                checkboxFlags: newFlags,
                sharedList: this.state.sharedList
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this15 = this;

            if (this.state.screen === 1) return React.createElement(NameCollection, {
                addName: function addName() {
                    return _this15.addName();
                },
                removeName: function removeName(i) {
                    return _this15.removeName(i);
                },
                names: this.state.names,
                nameRef: this.nameRef,
                advance: function advance() {
                    return _this15.advance();
                }
            });else if (this.state.screen === 2) return React.createElement(ItemCollection, {
                addItem: function addItem() {
                    return _this15.addItem();
                },
                removeItem: function removeItem(i) {
                    return _this15.removeItem(i);
                },
                items: this.state.items,
                itemRef: this.itemRef,
                priceRef: this.priceRef,
                retreat: function retreat() {
                    return _this15.retreat();
                },
                advance: function advance() {
                    return _this15.advance();
                }
            });else if (this.state.screen === 3) return React.createElement(EstablishRelation, {
                names: this.state.names,
                items: this.state.items,
                getFlag: function getFlag(i, j) {
                    return _this15.getFlag(i, j);
                },
                sharedList: this.state.sharedList,
                addShared: function addShared(i) {
                    return _this15.addShared(i);
                },
                removeShared: function removeShared(i) {
                    return _this15.removeShared(i);
                },
                toggleName: function toggleName(i, j) {
                    return _this15.toggleName(i, j);
                },
                allNames: function allNames(i) {
                    return _this15.allNames(i);
                },
                clearSelectedNames: function clearSelectedNames(i) {
                    return _this15.clearSelectedNames(i);
                },
                retreat: function retreat() {
                    return _this15.retreat();
                },
                advance: function advance() {
                    return _this15.advance();
                }
            });else if (this.state.screen === 4) return React.createElement(CalculateTax, {
                finalList: this.state.finalList,
                retreat: function retreat() {
                    return _this15.retreat();
                }
            });else return;
        }
    }]);

    return Split;
}(React.Component);

/*
ReactDOM.render(
    <Split id="split" />,
    document.getElementById('root')
);
*/

var container = document.querySelector('#split');
ReactDOM.render(React.createElement(Split, null), container);