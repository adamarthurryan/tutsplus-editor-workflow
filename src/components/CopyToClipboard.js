
import React, { Component } from 'react';

class CopyToClipboard extends Component {
    constructor() {
      super()
      this.childRef = React.createRef()
    }

    onClickCopy() {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(this.childRef.current);
        selection.removeAllRanges();
        selection.addRange(range);

        document.execCommand('copy')
        selection.removeAllRanges()
    }

    render() {
      return <div>
        <div className="ui basic segment">
            <button className="ui button" onClick={this.onClickCopy.bind(this)}>Copy to Clipboard</button>
        </div>
        <div ref={this.childRef}>
            {this.props.children}
        </div>
      </div>
    	
    }
}

export default CopyToClipboard