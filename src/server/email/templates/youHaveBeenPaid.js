import mailBody from 'root/src/server/email/templates/bodyTemplate/mailBody'
import { marketplaceUrl } from 'root/src/shared/constants/mail'

export default ({ amountRequest, dareTitle, dareLink, paypalEmail }) => {
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
            <tr>
                <td height="50" style="margin:0;padding:0;" width="100%"></td>
            </tr>
        </tbody>
    </table>
    `
	return mailBody(mailContent)
}
