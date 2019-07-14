import mailBody from 'root/src/server/email/templates/bodyTemplate/mailBody'
import { ourName } from 'root/src/shared/constants/mail'

export default ({ streamer, dareTitle, dareTitleLink, textFromStreamersReject }) => {
	const mailContent = `
            <!-- mail content -->
            <table border="0" cellpadding="0" cellspacing="0" style="margin-top:0;margin-bottom:0;margin-left:auto;margin-right:auto;padding:0;color:#354052;font-family:Roboto,sans-serif;font-size:26px;line-height:1.25;" width="80%" class="content">
              <tbody>
                <tr>
                  <td height="50" style="margin:0;padding:0;" width="100%"></td>
                </tr>
                <tr>
                  <td style="margin:0;padding:0;" width="100%">
                    <p style="font-weight:bold;font-size:40px;line-height:1;margin:0;">Dare Rejected</p>
                  </td>
                </tr>
                <tr>
                  <td height="50" style="margin:0;padding:0;" width="100%"></td>
                </tr>

                <tr>
                  <td style="margin:0;padding:0;" width="100%">
                    <p style="margin:0;padding:0;">${streamer} won’t do <a href="${dareTitleLink}">${dareTitle}</a> because:</p>
                    <p style="margin:0;padding:0;"><br><pre style="font-weight:bold;font-size:26px;line-height:1.23;" >${textFromStreamersReject}</pre></p>
                  </td>
                </tr>

                <tr>
                  <td height="50" style="margin:0;padding:0;" width="100%"></td>
                </tr>

                <tr>
                  <td style="margin:0;padding:0;" width="100%">
                    <p style="margin:0;padding:0;">The team here at ${ourName} extends our deepest condolences for the loss of your dare.</p>
                    <p style="margin:0;padding:0;">We swear to do our best to get your next dare accepted.</p>
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
