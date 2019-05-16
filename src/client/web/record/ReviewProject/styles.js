import {
	gtSmMediaQuery, smMediaQuery,
} from 'root/src/client/web/commonStyles'


export default {
	centered: {
		margin: '0 auto',
	},
	title: {
		marginTop: 28,
		marginBottom: 20,
		'@media (min-width: 1284px)': {
			marginBottom: 25,
		},
	},
	iframeContainer: {
		position: 'relative',
		overflow: 'hidden',
		paddingTop: '100%',
	},
	iframe: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		border: 0,
	},
	sidebar: {
		[smMediaQuery]: {
			marginTop: 10,
		},
		[gtSmMediaQuery]: {
			paddingLeft: 40,
		},
	},
	sidebarItem: {
		marginTop: 10,
		marginBottom: 10,
		'& button': {
			borderRadius: 20,
			marginTop: 0,
			marginBottom: 0,
		},
	},
	text: {
		marginTop: 15,
		height: 17,
		fontFamily: 'Roboto',
		fontSize: '20px',
		lineHeight: 1.21,
		color: '#000000',
		fontWeight: '400',
	},
	descriptionContainer: {
		marginTop: 19,
		marginBottom: 18.5,
		'@media (min-width: 768px)': {
			marginBottom: 10.5,
		},
		'@media (min-width: 1284px)': {
			marginBottom: 32,
		},
	},
	descriptionTitle: {
		width: 96,
		height: 24,
		fontFamily: 'Roboto',
		fontSize: 20,
		fontWeight: 'bold',
		lineHeight: 1.2,
		letterSpacing: 0.4,
		textAlign: 'center',
		color: '#000000',
	},
	description: {
		width: '100%',
		minHeight: 35,
		fontSize: 20,
		marginTop: 8,
	},
	'mb-10': {
		marginBottom: 10,
	},
	rejectDescription: {
		height: 82.8,
		fontFamily: 'Roboto',
		fontSize: 16,
		fontWeight: 'normal',
		fontStyle: 'normal',
		fontStretch: 'normal',
		lineHeight: 1.19,
		letterSpacing: 'normal',
		textAlign: 'left',
		backgroundColor: '#ffffff',
		boxSizing: 'border-box',
		paddingTop: 20,
		marginTop: 5,
		marginBottom: 0,
		paddingLeft: 6,
		resize: 'none',
		width: '100%',
	},
	rejectionContainer: {
		marginBottom: 15,
	},
	rejectMessage: {
		fontSize: 12,
	},
	red: {
		color: '#ff0000',
	},
}
