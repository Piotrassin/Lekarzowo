import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    id: PropTypes.string.isRequired
};

class Dialog extends React.Component {
    static dialogs = [];

    static open = (id) => (e) => {
        e.preventDefault();
        e.persist();
        let dialog = Dialog.dialogs.find(x => x.props.id === id);
        dialog.setState({ isOpen: true });
        document.body.classList.add('dialog-open');
    }

    static close = (id) => (e) => {
        e.preventDefault();
        e.persist();
        let dialog = Dialog.dialogs.find(x => x.props.id === id);
        dialog.setState({ isOpen: false });
        document.body.classList.remove('dialog-open');
    }

    constructor(props) {
        super(props);
        this.state = { isOpen: false };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        document.body.appendChild(this.element);
        Dialog.dialogs.push(this);
    }

    componentWillUnmount() {
        Dialog.dialogs = Dialog.dialogs.filter(x => x.props.id !== this.props.id);
        this.element.remove();
    }

    handleClick(e) {
        if (e.target.className === 'dialog-style') {
            Dialog.close(this.props.id)(e);
        }
    }

    render() {
        return (
            <div style={{display: + this.state.isOpen ? '' : 'none'}} onClick={this.handleClick} ref={el => this.element = el}>
                <div className="dialog-style">
                    <div className="dialog-body" id = {this.props.id}>
                        {this.props.children}
                    </div>
                </div>
                <div className="dialog-background"></div>
            </div>
        );
    }
}

Dialog.propTypes = propTypes;

export {Dialog};
