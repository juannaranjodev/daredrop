import reduxConnector from 'root/src/shared/util/reduxConnector'

import formSubmits from 'root/src/client/logic/form/selectors/formSubmits'
import stepForms from 'root/src/client/logic/form/selectors/stepForms'
import onLastStep from 'root/src/client/logic/form/selectors/onLastStep'
import onStep from 'root/src/client/logic/form/selectors/onStep'
import onFirstStep from 'root/src/client/logic/form/selectors/onFirstStep'
import stepFormCurrentPage from 'root/src/client/logic/form/selectors/stepFormCurrentPage'
import customSubmitsSelector from 'root/src/client/logic/form/selectors/customSubmitsSelector'
import customSubmitsDataSelector from 'root/src/client/logic/form/selectors/customSubmitsDataSelector'

import stepFormNextPage from 'root/src/client/logic/form/actions/stepFormNextPage'
import stepFormPrevPage from 'root/src/client/logic/form/actions/stepFormPrevPage'

import submitForm from 'root/src/client/logic/form/thunks/submitForm'
import savePartialForm from 'root/src/client/logic/form/thunks/savePartialForm'
import payPalCreateOrder from 'root/src/client/logic/form/thunks/payPalCreateOrder'
import payPalOnApprove from 'root/src/client/logic/form/thunks/payPalOnApprove'
import payPalOnError from 'root/src/client/logic/form/thunks/payPalOnError'
import customPayPalAction from 'root/src/client/logic/form/thunks/customPayPalAction'
import visibleLoadingBlockSelector from 'root/src/client/logic/list/selectors/visibleLoadingBlockSelector'

export default reduxConnector(
	[
		['onLastStep', onLastStep],
		['onStep', onStep],
		['onFirstStep', onFirstStep],
		['stepForms', stepForms],
		['formSubmits', formSubmits],
		['stepFormCurrentPage', stepFormCurrentPage],
		['customSubmits', customSubmitsSelector],
		['customSubmitsData', customSubmitsDataSelector],
		['visibleLoadingBlock', visibleLoadingBlockSelector],
	],
	[
		['stepFormNextPage', stepFormNextPage],
		['stepFormPrevPage', stepFormPrevPage],
		['savePartialForm', savePartialForm],
		['submitForm', submitForm],
		['payPalCreateOrder', payPalCreateOrder],
		['payPalOnApprove', payPalOnApprove],
		['payPalOnError', payPalOnError],
		['customPayPalAction', customPayPalAction],
	],
)
