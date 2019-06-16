import moment from 'moment'

export default (time) => {
	const timeAsStamp = moment(time).add(7, 'days').format('X') - moment().format('X')
	if (timeAsStamp >= 86400) {
		return `${Math.ceil(timeAsStamp / 86400)} days`
	}
	return `${Math.ceil(timeAsStamp / 3600)} hours`
}
