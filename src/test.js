import React from 'react';
import ReactDOM from 'react-dom';
import "./test.css"

class CollectNames extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };
        this.modalRef = React.createRef();
    }

    openModal = () => {
        this.setState({ modal: true }, () => document.addEventListener('mousedown', this.closeModal));
    }

    closeModal = (event) => {
        const modal = this.modalRef.current;
        if (event.target !== modal && !modal.contains(event.target)) {
            this.setState({ modal: false });
            document.removeEventListener('mousedown', this.closeModal);
        }
    }

    render() {
        /*
        const state1 = this.props.items.map((item, index) => (
            <ItemRow
                item={item.item}
                price={parseFloat(item.price)}
                key={index}
                onClick={() => this.props.removeItem(index)}
            />
        ));
        */

        const state1 = this.state.modal ? <div>This is state on</div> : <div>This is state off</div>;
        const test1 = <div>This is state on</div>;
        const test2 = <div>This is state off</div>;
        const overlay1 = <div class="overlay"></div>;
        const overlay2 =
            <div ref={this.modalRef} class="l-main-panel split-modal selected-cyan">
                <h3 style={{ color: "black"}}>Pick who pays</h3>

              <div class="l-input-row l-top-gap">
                  <div class="l-item l-item-field text-input-style">Beer</div>
                  <div class="l-item l-item-field text-input-style l-price-input">$20.00</div>
              </div>

              <div class="l-input-row">
                <div class="l-name l-item-field text-input-style selected clickable-light-overlay">
                  <input type="checkbox" checked style={{marginRight: "12px"}}/>
                    John
                </div>
              </div>
              <div class="l-input-row">
                  <div class="l-name l-item-field text-input-style">
                      <input type="checkbox" style={{ marginRight: "12px" }} />
                      Jane
                  </div>
              </div>
              <div class="l-input-row">
                  <div class="l-name l-item-field text-input-style selected">
                      <input type="checkbox" checked style={{ marginRight: "12px" }} />
                      Bill
                  </div>
              </div>
              <div class="l-input-row">
                  <div class="l-name l-item-field text-input-style selected">
                      <input type="checkbox" checked style={{ marginRight: "12px" }} />
                      Bob
                  </div>
              </div>

              <div class="l-input-row l-top-gap">
                  <button class="button space-right">All</button>
                  <button class="button space-left">None</button>
              </div>

              <div class="l-input-row">
                  <button class="button">Next</button>
              </div>
  
            </div>;

        return (
            <div style={{ height: "0px", }}>
                <header>
                    <h1 className="margin-center" id="header-test">Split Receipt</h1>
                </header>
                <main>
                    <h2>This is a smaller header</h2>
                    <span>inside a span</span>
                    <article>this is an article</article>
                    <div className="l-main-panel">
                        Theres stuff in here lalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalalala
                        <br />


                        <div className="l-input-row l-top-gap">
                            <input type="text" placeholder="Enter a name" className="l-main-input" />
                            <div className="l-input-button add" tabindex="0">+</div>
                        </div>


                        {/*
                            defaultValue is used because value will prevent writing inside of the input field....
                        */}
                        <div className="l-input-row l-top-gap">
                            <input type="text" placeholder="Enter an item" className="l-main-input l-item-field" />
                            <input type="text" placeholder="$___.__" defaultValue="$888.8888111111111111111111111111111" className="l-main-input l-price-input"/>
                            <div className="l-input-button add" tabindex="0">+</div>
                        </div>

                        <div class="l-input-row l-short-bottom">
                            <input type="text" defaultValue="Johnaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" class="l-name" />
                            <div class="l-input-button removeable" tabindex="0">
                                &#x00D7;
                            </div>
                        </div>


                        <div class="l-input-row l-top-gap">
                            <button class="button space-right">Clear</button>
                            <button class="button space-left">Next</button>
                        </div>


                        <div class="l-input-row l-short-bottom">
                            <input type="text" class="l-item l-item-field" defaultValue="Pizza" />
                            <input type="text" placeholder="$___.__" defaultValue="$25.26" class="l-item l-price-input" />
                            <div class="l-input-button removeable" tabindex="0">
                                &#x00D7;
                            </div>
                        </div>

                        <div class="l-input-row l-short-bottom">
                            <div class="l-item l-item-field text-input-style">Pizza</div>
                            <div class="l-item l-item-field text-input-style l-price-input">$25.26</div>
                        </div>

                        <div class="l-input-row l-short-bottom">
                            <input type="text" class="l-item l-item-field" defaultValue="Pizza" />
                            <input type="text" placeholder="$___.__" defaultValue="$25.26" class="l-item l-price-input" />
                            <div class="l-input-button removeable" tabindex="0">
                                &#x00D7;
                            </div>
                        </div>

                        <div class="l-input-row attached-name">
                            <div class="l-attached-name l-item-field l-name text-input-style" style={{ width: "auto" }}>
                                John
                            </div>
                            <div class="l-attached-name l-item-field l-name text-input-style" style={{ width: "auto" }}>
                                Jane
                            </div>
                            <div class="l-attached-name l-item-field l-name text-input-style" style={{ width: "auto" }}>
                                Bill
                            </div>
                            <div class="l-attached-name l-item-field l-name text-input-style" style={{ width: "auto" }}>
                                Bob
                            </div>
                            <div class="l-attached-name l-item-field l-name text-input-style" style={{ width: "auto" }}>
                                Lrrr, Ruler of the Planet Omicron Persei 8
                            </div>
                        </div>

                        <div class="l-input-row l-short-bottom" onClick={this.openModal}>
                            <div class="l-item l-item-field text-input-style">Pizza</div>
                            <div class="l-item l-item-field text-input-style l-price-input">$25.26</div>
                        </div>
                        

                    </div>
                    <br />
                    Main content goes here...
                    <br />

                </main>
                <footer>Footer here</footer>
                {this.state.modal ? overlay1 : ""}
                {this.state.modal ? overlay2 : ""}
            </div>
        );
    }
}

class Router extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            screen: 1,
        };
    }

    render() {
        if (this.state.screen === 1)
            return (
                <CollectNames
                />
            );
    }
}

ReactDOM.render(
    <Router id="router" />,
    document.getElementById('test')
);