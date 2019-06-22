export default (momentDate) => {
	const year = momentDate.year()
	const month = momentDate.month() + 1
	const day = momentDate.date()
	const hour = momentDate.hour()
	const minute = momentDate.minute()
	return `cron(${minute} ${hour} ${day} ${month} ? ${year})`
}
