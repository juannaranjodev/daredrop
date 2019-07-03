import React, { Component } from 'react'
import copy from 'copy-to-clipboard'
import { primaryColor } from 'root/src/client/web/commonStyles'

class AddToClipboard extends Component {
	constructor(props) {
		super(props)
		this.text = React.createRef()
		this.state = {
			isCopied: false,
		}
	}

	addToClipboard = () => {
		const { url } = this.props
		copy(url)
		this.setState({ isCopied: true })
	}

	render() {
		const { isCopied } = this.state
		return (
			<div style={{
				position: 'relative',
			}}
			>
				{ isCopied && (
					<div style={{
						position: 'absolute',
						right: -10,
						top: -23,
						color: '#ffffff',
						fontWeight: 'bold',
						backgroundColor: primaryColor,
						padding: '0px 12px',
						borderRadius: 5,
					}}
					>Copied!
					</div>
				) }
				<div onClick={this.addToClipboard}>{this.props.children}</div>
			</div>
		)
	}
}

export default AddToClipboard
