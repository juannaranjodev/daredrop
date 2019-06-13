module.exports = (env) => {
	switch (env) {
		case ('development'):
			return {
				TWITCH_CLIENT_ID: 'ts0c9c61bm0jm3nkdg36xh19ui8vk7',
				PAYPAL_CLIENT_ID: 'AZ7ruOMika_xOrNIVglKQcPUodUhuoe5ig4BDmZmVeZnWlm8dPCVenyrY7IZfyrT0ezOSDV_EtVwOPIe',
				STRIPE_CLIENT_ID: 'pk_test_tz3MDijvyLBp0ACUiYxLwZU2',
			}
		case ('production'):
			return {
				TWITCH_CLIENT_ID: 'ruosppbybmeq0au48f4hzhzs0jfmej',
				PAYPAL_CLIENT_ID: 'AUjfTQIkHBx0-WtUmsCTRk2_TgGcTH29xV9nxRZ09q1_ti9--64Orv7E47CsH5n_c_CER_qXN3woBjV9',
				STRIPE_CLIENT_ID: 'pk_live_5YsMUBe3yGG1GL0gGDnPFyGe00kHLd5X7L',
			}
		default:
			return {}
	}
}
