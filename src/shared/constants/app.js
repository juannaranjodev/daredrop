module.exports = (env) => {
	switch (env) {
		case ('development'):
			return {
				TWITCH_CLIENT_ID: 'ts0c9c61bm0jm3nkdg36xh19ui8vk7',
				PAYPAL_CLIENT_ID: 'AZ7ruOMika_xOrNIVglKQcPUodUhuoe5ig4BDmZmVeZnWlm8dPCVenyrY7IZfyrT0ezOSDV_EtVwOPIe',
			}
		case ('production'):
			return {
				TWITCH_CLIENT_ID: 'ruosppbybmeq0au48f4hzhzs0jfmej',
				PAYPAL_CLIENT_ID: 'none',
			}
		default:
			return {}
	}
}
