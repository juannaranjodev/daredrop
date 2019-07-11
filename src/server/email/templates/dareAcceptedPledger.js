import mailBody from 'root/src/server/email/templates/bodyTemplate/mailBody'
import expiryCalculator from 'root/src/server/email/util/expiryCalculator'
import { ourName } from 'root/src/shared/constants/mail'

export default ({ streamers, dareTitle, goal, expiryTime, dareTitleLink }) => {
	const mailContent = `
            <table border="0" cellpadding="0" cellspacing="0" style="margin-top:0;margin-bottom:0;margin-left:auto;margin-right:auto;padding:0;color:#354052;font-family:Roboto,sans-serif;font-size:26px;line-height:1.25;" width="480" class="content">
              <tbody>
                <tr>
                  <td height="50" style="margin:0;padding:0;" width="100%"></td>
                </tr>
                <tr>
                  <td style="margin:0;padding:0;" width="100%">
                    <p style="font-weight:bold;font-size:40px;line-height:1;margin:0;text-align:center">Dare Accepted</p>
                  </td>
                </tr>
                <tr>
                  <td height="50" style="margin:0;padding:0;" width="100%"></td>
                </tr>

                <tr>
                  <td style="margin:0;padding:0;" width="100%">
                    <p style="margin:0;padding:0;">${streamers} has accepted your Dare to <a href="${dareTitleLink}">${dareTitle}</a>!</p>
                  </td>
                </tr>

                <tr>
                  <td height="50" style="margin:0;padding:0;" width="100%"></td>
                </tr>

                <tr>
                  <td style="margin:0; padding:0;" width="100%">
                    <p style="margin:0;padding:0;">${streamers} said they’d deliver if our bounty hits $${goal}. Can we get there in the ${expiryCalculator(expiryTime)} left?</p>
                  </td>
                </tr>

                <tr>
                  <td height="50" style="margin:0;padding:0;" width="100%"></td>
                </tr>

                <tr>
                  <td style="margin:0; padding:0;" width="100%">
                    <p style="margin:0;padding:0;">We’re telling our friends. Remember to tell yours so we can see this happen!</p>
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
