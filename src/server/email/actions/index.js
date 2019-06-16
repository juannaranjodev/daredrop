import { CONFIRMATION_TRIGGER } from 'root/src/server/email/actions/triggerSourceIds'
import sendWelcomeEmail from 'root/src/server/email/actions/sendWelcomeEmail'

export default {
	[CONFIRMATION_TRIGGER]: sendWelcomeEmail,
}
