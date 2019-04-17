import React, { Component } from 'react'
import copy from 'copy-to-clipboard'

class AddToClipboard extends Component {
	constructor(props) {
		super(props)
		this.text = React.createRef()
	}

	addToClipboard = () => {
		const { url } = this.props
		copy(url)
	}

	render() {
		return (
			<div>
				<div onClick={this.addToClipboard}>{this.props.children}</div>
			</div>
		)
	}
}

export default AddToClipboard
