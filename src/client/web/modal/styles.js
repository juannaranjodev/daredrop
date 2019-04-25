const styles = {
	backdrop: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(0,0,0,0.5)',
		zIndex: 100,
		display: 'flex',
		alignItems: 'flex-start',
		justifyContent: 'center',
		paddingTop: 82,
		'@media (max-width: 425px)': {
			paddingTop: 79,
		},
	},
	modal: {
		zIndex: 101,
		width: 503,
		height: 398,
		borderRadius: 6,
		backgroundColor: '#ffffff',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'stretch',
		'@media (max-width: 425px)': {
			width: 360,
		},
	},
	closeContainer: {
		display: 'flex',
		justifyContent: 'flex-end',
		height: 32,
	},
	close: {
		width: 21,
		height: 21,
		marginTop: 11,
		marginRight: 11,
		padding: 0,
		backgroundColor: 'transparent',
		border: 'none',
		cursor: 'pointer',
	},
	contentContainer: {
		display: 'flex',
		flex: 1,
	},
	hide: {
		display: 'none',
	},
	container: {
		display: 'flex',
		flex: 1,
		justifyContent: 'center',
	},
	content: {
		width: 360,
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'stretch',
		'@media (max-width: 425px)': {
			width: 342,
		},
	},
	title: {
		height: 24,
		fontFamily: 'Roboto',
		fontSize: 20,
		fontWeight: 'bold',
		lineHeight: 1.2,
		textAlign: 'center',
		color: '#000000',
		marginBottom: 23,
	},
	text: {
		height: 85,
		fontFamily: 'Roboto',
		fontSize: 20,
		lineHeight: 1.2,
		textAlign: 'center',
		color: '#000000',
		marginBottom: 4,
	},
}

 export default styles
  
