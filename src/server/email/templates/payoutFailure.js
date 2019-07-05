import mailBody from 'root/src/server/email/templates/bodyTemplate/mailBody'
import { ourName, paypalEmailUrl } from 'root/src/shared/constants/mail'

export default () => {
	const mailContent = `
              <table border="0" cellpadding="0" cellspacing="0" style="margin-top:0;margin-bottom:0;margin-left:auto;margin-right:auto;padding:0;color:#354052;font-family:Roboto,sans-serif;font-size:26px;line-height:1.25;" width="80%" class="content">
                <tbody>
                  <tr>
                    <td height="50" style="margin:0;padding:0;" width="100%"></td>
                  </tr>
                  <tr>
                    <td style="margin:0;padding:0;" width="100%">
                      <p style="font-weight:bold;font-size:40px;line-height:1;margin:0;">Payment Failure</p>
                    </td>
                  </tr>
                  <tr>
                    <td height="50" style="margin:0;padding:0;" width="100%"></td>
                  </tr>

                  <tr>
                    <td style="margin:0;padding:0;" width="100%">
                      <p style="margin:0;padding:0;">We tried to pay you, but failed because we don’t know your payment information.</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="margin:0;padding:0;" width="100%">
                      <p style="margin:0;padding:0;">Please add your PayPal email <a href="http://${paypalEmailUrl}">HERE</a> so we know where to send your money.</p>
                    </td>
                  </tr>

                  <tr>
                    <td height="50" style="margin:0;padding:0;" width="100%"></td>
                  </tr>

                  <tr>
                    <td style="margin:0; padding:0;" width="100%">
                      <p style="margin:0;padding:0;">The ${ourName} Team</p>
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
