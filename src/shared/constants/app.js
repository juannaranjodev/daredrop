module.exports = (env) => {
	switch (env) {
		case ('development'):
			return {
				TWITCH_CLIENT_ID: 'ts0c9c61bm0jm3nkdg36xh19ui8vk7',
			}
		case ('production'):
			return {
				TWITCH_CLIENT_ID: 'ruosppbybmeq0au48f4hzhzs0jfmej',
			}
		default:
			return {}
	}
}
