import {
	primaryColor,
} from 'root/src/client/web/commonStyles'

import modalStyle from 'root/src/client/web/list/modalStyle'

export const projectCardStyle = {
	cardRoot: {
		margin: [[0, 10, 20]],
		color: 'white',
		width: '280px',
		alignSelf: 'center',
		height: '306px',
		borderRadius: '4px',
		overflow: 'hidden',
		boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
		cursor: 'pointer',
		transition: '0.1s',
		position: 'relative',

	},
	progressOuter: {
		width: '100%',
		height: 6,
		borderRadius: 8,
		border: '1px solid rgba(128, 0, 128, 0.2)',
		backgroundColor: '#ffffff',
		boxSixing: 'border-box',
	},
	progressInner: {
		marginTop: -1,
		marginLeft: -1,
		height: 8,
		borderRadius: 8,
		backgroundColor: '#800080',
	},
	hover: {
		boxShadow: '0 1px 26px 0 rgba(0,0,0,1)',
		transform: 'scale(1.05)',
	},
	cardBg: {
		backgroundPosition: 'bottom',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		height: '100%',
		width: '280px',
		transition: '0.7s',
	},
	cardHeader: {
		height: 60,
		backgroundColor: 'rgba(0, 0, 0, 0.74)',
		transition: '0.7s',
		display: 'flex',
		flexDirection: 'column',

	},
	headerText: {
		fontSize: '20px',
		display: 'flex',
		WebkitLineClamp: 2,
		WebkitBoxOrient: 'vertical',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		transition: '0s',
		flexDirection: 'column',
		justifyContent: 'center',
		zIndex: 201,
	},
	headerTextH3: {
		fontSize: '20px',
		fontFamily: 'Roboto',
		fontWeight: '500',
		fontStyle: 'normal',
		fontStretch: 'normal',
		lineHeight: '1.2',
		letterSpacing: '0.3px',
		transition: '0s',
		margin: 0,
		zIndex: 201,
		display: '-webkit-box',
		'-webkit-line-clamp': 2,
		'-webkit-box-orient': 'vertical',
	},
	cardFooter: {
		height: 147,
		backgroundColor: 'rgba(0, 0, 0, 0.74)',
		padding: [[11, 16, 8]],
		transition: '0.7s',
	},
	cardGameTitle: {
		marginBottom: 10,
		transition: '0s',
		zIndex: 201,
	},
	description: {
		height: 40,
		display: '-webkit-box',
		WebkitLineClamp: 2,
		WebkitBoxOrient: 'vertical',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		marginBottom: 60,
		transition: '0s',
		zIndex: 201,
	},
	playIcon: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		zIndex: 202,
	},
	assigneeImg: {
		width: 100,
		height: 100,
		transition: '0s',
		'&:not(:only-of-type)': {
			marginRight: -2,
		},
		'&:nth-last-child(n+3), &:nth-last-child(n+3) ~ img': {
			width: 90,
			height: 90,
		},
		'&:nth-last-child(n+4), &:nth-last-child(n+4) ~ img': {
			width: 70,
			height: 70,
		},
		'&:nth-last-child(n+5), &:nth-last-child(n+5) ~ img': {
			width: 50,
			height: 50,
		},
		'&:nth-child(n+6), &:nth-child(n+6) ~ img': {
			marginTop: -5,
		},
		'&:nth-last-child(n+11), &:nth-last-child(n+11) ~ img': {
			width: 25,
			height: 25,
		},
		'&:nth-last-child(n+41), &:nth-last-child(n+41) ~ img': {
			width: 15,
			height: 15,
		},
		'&:nth-last-child(n+101), &:nth-last-child(n+101) ~ img': {
			width: 7,
			height: 7,
		},
	},
	descriptionText: {
		fontWeight: 'normal',
		fontStyle: 'normal',
		fontStretch: 'normal',
		lineHeight: '1.25',
		letterSpacing: '0.3px',
		fontFamily: 'Roboto',
		transition: '0.7s',
	},
	buttonContainer: {
		textAlign: 'center',
		marginTop: -42,
		margin: '0 auto',
		width: '93px',
	},
	projectAssigne: {
		display: 'flex',
		flexWrap: 'wrap',
		alignItems: 'center',
		padding: '7 auto',
		height: 100,
		marginBottom: 7,
		position: 'relative',
		marginTop: 7,
	},
	button: {
		width: '93px',
		height: '36px',
		borderRadius: '20px',
		zIndex: 201,
		'& span': {
			fontWeight: 'bold',
			textTransform: 'none',
			fontSize: 18,
			lineHeight: 1.20,
			letterSpacing: 1.6,
		},
	},
	shareIcon: {
		height: '100%',
		margin: [[0, 0, -12, 0]],
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end',
	},
	inLineBlock: {
		display: 'inline',
	},
	projectUnsetJustify: {
		justifyContent: 'start !important',
		marginLeft: 18,
		marginRight: 18,
	},
	hoveredName: {
		fontSize: 14,
		background: '#800080',
		fontWeight: 'bold',
		borderRadius: 5,
		padding: 10,
		width: 'auto',
	},
	hoveredNameContainer: {
		width: '100%',
		position: 'absolute',
		display: 'flex',
		justifyContent: 'center',
		top: 0,
	},
	bodyCard: {
		position: 'relative',
	},
	videoOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		zIndex: 200,
		backgroundColor: 'rgba(0, 0, 0, 0.74)',
		overflow: 'hidden',
	},
	noOverlay: {
		backgroundColor: 'rgba(0, 0, 0, 0)',
		hoveredName: {
			fontSize: 14,
			background: '#800080',
			fontWeight: 'bold',
			borderRadius: 5,
			padding: 10,
			width: 'auto',
		},
		hoveredNameContainer: {
			width: '100%',
			position: 'absolute',
			display: 'flex',
			justifyContent: 'center',
			top: 0,
		},
		bodyCard: {
			position: 'relative',
		},
	},
	marksContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		height: 14,
	},
	pledgedMark: {
		fontSize: 12,
		fontWeight: 'bold',
		color: primaryColor,
		backgroundColor: 'white',
		textAlign: 'center',
		border: `1px solid ${primaryColor}`,
		lineHeight: 1.17,
		height: '100%',
		borderRadius: 5,
		width: '100%',
		fontStyle: 'italic',
		zIndex: 201,
	},
	acceptedMark: {
		border: `1px solid ${primaryColor}`,
		color: 'white',
		backgroundColor: primaryColor,
		width: '100%',
		height: '100%',
		borderRadius: 5,
		lineHeight: 1.17,
		textAlign: 'center',
		fontSize: 12,
		fontWeight: 'bold',
		fontStyle: 'italic',
		zIndex: 201,
	},
	headerContainer: {
		width: '100%',
		display: 'flex',
		height: '100%',
		padding: [[0, 16]],
	},
}


export const listStyle = {
	listModuleContainer: {
		display: 'flex',
		flexDirection: 'column',
	},
	iconContainer: {
		display: 'flex',
		justifyContent: 'center',
	},
	goTopContainer: {
		cursor: 'pointer',
		display: 'flex',
		justifyContent: 'center',
		marginTop: 20,
		marginBottom: 20,
		fontWeight: 'bold',
		fontSize: 18,
	},
	paddingOffset: {
		justifyContent: 'center',
		borderRadius: 5,
		boxShadow: '0 3px 26px 0 rgba(0, 0, 0, 0.16)',
		border: 'solid 0.2px #800080',
		backgroundColor: '#ffffff',
		padding: 20,
	},
	list: {
		width: 340,
		margin: '0 auto',
	},
	subtitle: {
		alignSelf: 'flex-start',
		fontWeight: 'bold',
		fontSize: 20,
		margin: '10px 0 25px 0',
	},
	buttons: {
		margin: '10px 0 50px 0',
		width: '100%',
	},
	...modalStyle,
}
