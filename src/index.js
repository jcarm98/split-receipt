import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css"

// value for controlled inputs, defaultValue for non-controlled inputs

import { toast } from './utils/toast.js';
import { confirm } from './utils/modals.js';

import { CollectNames } from './panels/collect_names.js';
import { CollectItems } from './panels/collect_items.js';
import { ItemMapping } from './panels/item_mapping.js';
import { Results } from './panels/results.js';


const NAMECOLLECTION = 'nameCollection';
const ITEMCOLLECTION = 'itemCollection';
const ITEMMAPPING = 'itemMapping';
const RESULTS = 'results';

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

    /* Get object from state with enum and constants */
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

    /* Store object to state with enum and constants */
    storeToKey(stateKey, value, setStateCB = undefined, stateOwner = this) {
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
        Modular create function layered within another function, takes a callback
    */
    create(list, stateOwner = this) {
        return (value, validation = undefined, setStateCB = undefined) => {
            if (validation && !validation(value())) return;
            let stateList = this.keyToList(list);
            stateList.push(value());
            this.storeToKey(list, stateList, setStateCB, stateOwner);
        }
    }

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
        Modular udate function layered within another function, takes a callback
    */
    update(list, stateOwner = this) {
        return (index, value, validation = undefined, setStateCB = undefined) => {
            if (validation && !validation(value())) return;
            let stateList = this.keyToList(list);
            stateList[index] = value();
            this.storeToKey(list, stateList, setStateCB, stateOwner);
        }
    }

    /**
     destroy:
        list to modify
        index to remove
        setstate cb
        state owner
     * */
    /**
        Modular delete function layered within another function, takes a callback
    */
    delete(list, stateOwner = this) {
        return (index, setStateCB = undefined) => {
            let stateList = this.keyToList(list);
            stateList.splice(index, 1);
            this.storeToKey(list, stateList, setStateCB, stateOwner)
        }
    }

    /* Open a confirm modal before clearing list */
    clear(list) {
        return (callback = undefined) => {
            confirm("Are you sure you want to clear this list?", () => { this.storeToKey(list, []); if (callback) callback() });
        }
    }

    /*
        Change the current active stage/panel.
        Validation on stage changes, notifies user with toast.
        Sets the focus to the next input on stage change.
    */
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
                else if (mapped.names.length < 1) {
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
            setTimeout(()=>{document.getElementById("stage-2-focus").focus();}, 1000);
        }
        else if (stage === ITEMMAPPING) {
            document.getElementById("stage-3-focus").focus();
        }
        else if (stage === RESULTS) {
            document.getElementById("stage-4-focus").focus();
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
        /* Configure carousel styles */
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
            "--x-offset": -10,
            "zIndex": "-4"
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
            "left": "-50%",
            "zIndex": "-4"
        };
        let styles = [{ ...base }, { ...base }, { ...base }, { ...base }];
        if (this.state.stage === NAMECOLLECTION) {
            styles[0] = undefined;
            styles[1] = { ...right1 };
            styles[2] = { ...right2 }
            styles[3] = {
                "--abs-offset": 1,
                "--offset": -1,
                "--direction": -1,
                "--x-scale": 0.875,
                "--x-offset": -10,
                "zIndex": "-5"
            };
        }
        else if (this.state.stage === ITEMCOLLECTION) {
            styles[0] = { ...left1 };
            styles[1] = undefined;
            styles[2] = { ...right1 }
            styles[3] = { ...right2 }
        }
        else if (this.state.stage === ITEMMAPPING) {
            styles[0] = { ...left2 }
            styles[1] = { ...left1 };
            styles[2] = undefined;
            styles[3] = { ...right1 };
        }
        else if (this.state.stage === RESULTS) {
            styles[0] = {
                "--abs-offset": 1,
                "--offset": 1,
                "--direction": 1,
                "--x-scale": 0.875,
                "--x-offset": 10,
                "left": "-50%",
                "zIndex": "-5"
            };
            styles[1] = { ...left2 }
            styles[2] = { ...left1 }
            styles[3] = undefined;
        }
        return (
            <div className="l-align-footer">
                <header>
                    <h1 className="transform-center" id="header-test">Split Receipt</h1>
                </header>
                <main>
                    <div className="carousel-wrapper">
                        <div className="carousel">
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
    document.getElementById('root')
);
