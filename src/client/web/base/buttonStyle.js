import {
	primaryColor, secondaryColor,
} from 'root/src/client/web/commonStyles'

export default {
	button: {
		display: 'flex',
		color: 'white',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: primaryColor,
		'&:hover': {
			backgroundColor: secondaryColor,
		},
		width: '100%',
		height: 48.1,
		textTransform: 'none',
		fontSize: 18,
		marginBottom: 20,
		borderRadius: 200,
		fontWeight: 500,
		lineHeight: 1,
		'& .button-subtitle': {
			fontSize: 12,
			fontWeight: 200,
		},
	},
	smallButton: {
		width: '20%',
		margin: 'auto 0',
		marginLeft: '5px',
	},
	primaryButton: {
		padding: 10,
		fontSize: 18,
		textTransform: 'none',
		boxShadow: '0 5px 6px 0 rgba(0, 0, 0, 0.16)',
	},
	noBackgroundButton: {
		padding: 10,
		fontSize: 18,
		textTransform: 'none',
		marginTop: 10,
		marginBottom: 25,
		color: primaryColor,
		backgroundColor: 'transparent',
		boxShadow: 'none',
		'&:hover': {
			color: secondaryColor,
			backgroundColor: 'transparent',
		},
	},
	outlinedButton: {
		color: primaryColor,
		border: `1px solid ${primaryColor}`,
		backgroundColor: 'transparent',
		padding: 'auto',
		fontSize: 18,
		textTransform: 'none',
		boxShadow: '0 5px 6px 0 rgba(0, 0, 0, 0.16)',
		'&:hover': {
			color: secondaryColor,
			backgroundColor: 'transparent',
		},
	},
	unstyled: {
		color: primaryColor,
		backgroundColor: 'transparent',
		boxShadow: 'none',
		'&:hover': {
			color: primaryColor,
			backgroundColor: 'transparent',
		},
	},
}
