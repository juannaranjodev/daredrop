import mailBody from 'root/src/server/email/templates/bodyTemplate/mailBody'
import { marketplaceUrl, paypalEmailUrl } from 'root/src/shared/constants/mail'
import { isNil } from 'ramda'

export default ({ amountRequest, dareTitle, dareLink, paypalEmail }) => {
	let content = ''
	if (!isNil(paypalEmail)) {
		content = `
        <tr>
            <td style="margin:0;padding:0;" width="100%">
                <p style="margin:0;padding:0;text-align:center">We just sent you ${amountRequest} for delivering <a href="${dareLink}">${dareTitle}</a> via the paypal account you gave us: ${paypalEmail}</p>
            </td>
        </tr>
        <tr>
            <td height="50" style="margin:0;padding:0;" width="100%"></td>
        </tr>
        <tr>
            <td style="margin:0;padding:0;" width="100%">
                <p style="margin:0;padding:0; text-align:center">Filter our <a href="${marketplaceUrl}">Marketplace</a> by your Twitch username to find more dares!</p>
            </td>
        </tr>
        `
	} else {
		content = `
        <tr>
            <td style="margin:0;padding:0;" width="100%">
                <p style="margin:0;padding:0;text-align:center">You just earned money for delivering <a href="${dareLink}">${dareTitle}</a>, but we can't pay you because you haven't added a PayPal email in Dare Drop yet.</p>
            </td>
        </tr>
        <tr>
            <td height="50" style="margin:0;padding:0;" width="100%"></td>
        </tr>
        <tr>
            <td style="margin:0;padding:0;" width="100%">
                <p style="margin:0;padding:0; text-align:center">Go <a href="${paypalEmailUrl}">here</a> to give us your PayPal email & get paid.</p>
            </td>
        </tr>
        `
	}

	const mailContent = `
    <table border="0" cellpadding="0" cellspacing="0" style="margin-top:0;margin-bottom:0;margin-left:auto;margin-right:auto;padding:0;color:#354052;font-family:Roboto,sans-serif;font-size:26px;line-height:1.25;" width="480" class="content">
        <tbody>
            <tr>
                <td height="50" style="margin:0;padding:0;" width="100%"></td>
            </tr>
            <tr>
                <td style="margin:0;padding:0;" width="100%">
                    <p style="font-weight:bold;font-size:40px;line-height:1;margin:0;">You've been paid</p>
                </td>
            </tr>
            <tr>
                <td height="50" style="margin:0;padding:0;" width="100%"></td>
            </tr>
                ${content}
            <tr>
                <td height="50" style="margin:0;padding:0;" width="100%"></td>
            </tr>
        </tbody>
    </table>
    `
	return mailBody(mailContent)
}
