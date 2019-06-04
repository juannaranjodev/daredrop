import createStore from 'root/src/shared/util/createStore'

import initApp from 'root/src/client/logic/app/thunks/initApp'
import testMediaBreakpoints from 'root/src/client/logic/app/thunks/testMediaBreakpoints'

// reducers
import initAppReducer from 'root/src/client/logic/app/reducers/initAppReducer'
import authDetermined from 'root/src/client/logic/app/reducers/authDetermined'
import setMediaBreakpoints from 'root/src/client/logic/app/reducers/setMediaBreakpoints'
import changeRoute from 'root/src/client/logic/route/reducers/changeRoute'

// form
import changeInput from 'root/src/client/logic/form/reducers/changeInput'
import clearFormErrors from 'root/src/client/logic/form/reducers/clearFormErrors'
import clearForm from 'root/src/client/logic/form/reducers/clearForm'
import setFormErrors from 'root/src/client/logic/form/reducers/setFormErrors'
import submitForm from 'root/src/client/logic/form/reducers/submitForm'
import submitFormComplete from 'root/src/client/logic/form/reducers/submitFormComplete'
import addSubForm from 'root/src/client/logic/form/reducers/addSubForm'
import removeSubForm from 'root/src/client/logic/form/reducers/removeSubForm'
import stepFormNextPage from 'root/src/client/logic/form/reducers/stepFormNextPage'
import stepFormPrevPage from 'root/src/client/logic/form/reducers/stepFormPrevPage'
import partialFormDbSaveSuccess from 'root/src/client/logic/form/reducers/partialFormDbSaveSuccess'
import clearPartialFormKeys from 'root/src/client/logic/form/reducers/clearPartialFormKeys'
import clearAllForms from 'root/src/client/logic/form/reducers/clearAllForms'

// api
import apiListRequestError from 'root/src/client/logic/api/reducers/apiListRequestError'
import apiListRequestSuccess from 'root/src/client/logic/api/reducers/apiListRequestSuccess'
import apiRecordRequestError from 'root/src/client/logic/api/reducers/apiRecordRequestError'
import apiRecordRequestSuccess from 'root/src/client/logic/api/reducers/apiRecordRequestSuccess'
import initApiListRequest from 'root/src/client/logic/api/reducers/initApiListRequest'
import initApiRecordRequest from 'root/src/client/logic/api/reducers/initApiRecordRequest'
import generalRecordModification from 'root/src/client/logic/api/reducers/generalRecordModification'
import currentListPayload from 'root/src/client/logic/api/reducers/currentListPayload'

// project
import favoritesProcessingStart from 'root/src/client/logic/project/reducers/favoritesProcessingStart'
import favoritesProcessingEnd from 'root/src/client/logic/project/reducers/favoritesProcessingEnd'
import uploadProgress from 'root/src/client/logic/project/reducers/uploadProgress'

import apiRecordClickActionRequestError from 'root/src/client/logic/api/reducers/apiRecordClickActionRequestError'
import apiRecordClickActionRequestSuccess from 'root/src/client/logic/api/reducers/apiRecordClickActionRequestSuccess'
import initApiRecordClickActionRequest from 'root/src/client/logic/api/reducers/initApiRecordClickActionRequest'
import deletePaymentMethodOnSuccess from 'root/src/client/logic/list/reducers/deletePaymentMethodOnSuccess'
import setDefaultPaymentMethodOnSuccess from 'root/src/client/logic/list/reducers/setDefaultPaymentMethodOnSuccess'
import addPaymentMethodOnSuccess from 'root/src/client/logic/list/reducers/addPaymentMethodOnSuccess'
import addPayoutMethodOnSuccess from 'root/src/client/logic/payoutMethod/reducers/addPayoutMethodOnSuccess'

// list
import setFirstPage from 'root/src/client/logic/list/reducers/setFirstPage'
import currentPage from 'root/src/client/logic/list/reducers/currentPage'
import hasMore from 'root/src/client/logic/list/reducers/hasMore'

import apiExternalRequestSuccess from 'root/src/client/logic/api/reducers/apiExternalRequestSuccess'
import apiExternalRequestError from 'root/src/client/logic/api/reducers/apiExternalRequestError'

import apiFetchUserDataSuccess from 'root/src/client/logic/api/reducers/apiFetchUserDataSuccess'

// listeners
import popStateListener from 'root/src/client/logic/route/listeners/popStateListener'
import windowSizeListener from 'root/src/client/logic/app/listeners/windowSizeListener'

// modal
import displayModal from 'root/src/client/logic/modal/reducers/displayModal'


const store = createStore(
	{
		...initAppReducer,
		...authDetermined,
		...setMediaBreakpoints,
		...changeRoute,
		...changeInput,
		...stepFormNextPage,
		...stepFormPrevPage,
		...clearFormErrors,
		...clearForm,
		...clearAllForms,
		...setFormErrors,
		...submitForm,
		...submitFormComplete,
		...addSubForm,
		...removeSubForm,
		...apiListRequestError,
		...apiListRequestSuccess,
		...apiRecordRequestError,
		...apiRecordRequestSuccess,
		...initApiListRequest,
		...initApiRecordRequest,
		...apiRecordClickActionRequestError,
		...apiRecordClickActionRequestSuccess,
		...initApiRecordClickActionRequest,
		...generalRecordModification,
		...apiExternalRequestSuccess,
		...apiFetchUserDataSuccess,
		...partialFormDbSaveSuccess,
		...clearPartialFormKeys,
		...deletePaymentMethodOnSuccess,
		...apiExternalRequestError,
		...addPaymentMethodOnSuccess,
		...deletePaymentMethodOnSuccess,
		...setDefaultPaymentMethodOnSuccess,
		...partialFormDbSaveSuccess,
		...clearPartialFormKeys,
		...deletePaymentMethodOnSuccess,
		...currentListPayload,
		...currentPage,
		...hasMore,
		...setFirstPage,
		...favoritesProcessingStart,
		...favoritesProcessingEnd,
		...displayModal,
		...addPayoutMethodOnSuccess,
		...uploadProgress,
	}, // reducer object
	// [], // sagas
	[
		popStateListener,
		windowSizeListener,
	], // listeners
	{}, // initial state
	[
		initApp,
		testMediaBreakpoints,
	],
)

export default store
