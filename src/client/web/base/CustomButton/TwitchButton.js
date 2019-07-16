import React, { memo } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitch } from 'fortawesome-light/fontawesome-light'
import { orNull } from 'root/src/shared/util/ramdaPlus'
import { styledTwitchButton } from './style'

const Button = memo(({ title, subtitle, classes, withIcon, href, onClick }) => (
	<a className={classes.link} href={href}>
		<button onClick={() => onClick()} type="button" className={classes.button}>
			{orNull(withIcon,
				<FontAwesomeIcon icon={faTwitch} size="lg" color="#800080" />)}
			<div>
				<div>{title}</div>
				<span className="button-subtitle">{subtitle}</span>
			</div>
		</button>
	</a>
))

Button.propTypes = {
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string,
}

Button.defaultProps = {
	subtitle: '',
}
export default withStyles(styledTwitchButton)(Button)
