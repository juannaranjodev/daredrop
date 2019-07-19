import { CONFIRMATION_TRIGGER, PRE_SIGNUP } from 'root/src/server/api/triggerActions/triggerSourceIds'
import sendWelcomeEmail from 'root/src/server/api/triggerActions/sendWelcomeEmail'
import emailToLowerCase from 'root/src/server/api/triggerActions/emailToLowerCase'

export default {
	[CONFIRMATION_TRIGGER]: sendWelcomeEmail,
	[PRE_SIGNUP]: emailToLowerCase,
}
