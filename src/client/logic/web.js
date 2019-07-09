import createStore from 'root/src/shared/util/createStore'

import initApp from 'root/src/client/logic/app/thunks/initApp'
import testMediaBreakpoints from 'root/src/client/logic/app/thunks/testMediaBreakpoints'
import setTimeoutId from 'root/src/client/logic/project/reducers/setTimeoutId'

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
import clearList from 'root/src/client/logic/api/reducers/clearList'
import clearListProcessing from 'root/src/client/logic/api/reducers/clearListProcessing'

// project
import favoritesProcessingStart from 'root/src/client/logic/project/reducers/favoritesProcessingStart'
import favoritesProcessingEnd from 'root/src/client/logic/project/reducers/favoritesProcessingEnd'
import uploadProgress from 'root/src/client/logic/project/reducers/uploadProgress'

import apiRecordClickActionRequestError from 'root/src/client/logic/api/reducers/apiRecordClickActionRequestError'
import apiRecordClickActionRequestSuccess from 'root/src/client/logic/api/reducers/apiRecordClickActionRequestSuccess'
import initApiRecordClickActionRequest from 'root/src/client/logic/api/reducers/initApiRecordClickActionRequest'
import deletePaymentMethodOnSuccess from 'root/src/client/logic/list/reducers/deletePaymentMethodOnSuccess'
import setDefaultPaymentMethodOnSuccess from 'root/src/client/logic/list/reducers/setDefaultPaymentMethodOnSuccess'
import addPayoutMethodOnSuccess from 'root/src/client/logic/payoutMethod/reducers/addPayoutMethodOnSuccess'

// list
import setFirstPage from 'root/src/client/logic/list/reducers/setFirstPage'
import currentPage from 'root/src/client/logic/list/reducers/currentPage'
import hasMore from 'root/src/client/logic/list/reducers/hasMore'
import setVisibleLoadingBlock from 'root/src/client/logic/list/reducers/setVisibleLoadingBlock'

// headers
import addSortFilterParams from 'root/src/client/logic/header/reducers/addSortFilterParams'
import cleareProjectArray from 'root/src/client/logic/header/reducers/clearProjectArray'
import setGameFilterValue from 'root/src/client/logic/header/reducers/setGameFilterValue'
import setStreamerFilterValue from 'root/src/client/logic/header/reducers/setStreamerFilterValue'
import clearFilterParams from 'root/src/client/logic/header/reducers/clearFilterParams'
import setSortValue from 'root/src/client/logic/header/reducers/setSortValue'

import apiExternalRequestSuccess from 'root/src/client/logic/api/reducers/apiExternalRequestSuccess'
import apiExternalRequestError from 'root/src/client/logic/api/reducers/apiExternalRequestError'

import apiFetchUserDataSuccess from 'root/src/client/logic/api/reducers/apiFetchUserDataSuccess'

// listeners
import popStateListener from 'root/src/client/logic/route/listeners/popStateListener'
import windowSizeListener from 'root/src/client/logic/app/listeners/windowSizeListener'

// modal
import displayModal from 'root/src/client/logic/modal/reducers/displayModal'

// embedded
import changeEmbeddedFieldData from 'root/src/client/logic/embedded/reducers/changeEmbeddedFieldData'

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
		...addSortFilterParams,
		...cleareProjectArray,
		...setGameFilterValue,
		...setStreamerFilterValue,
		...clearFilterParams,
		...setTimeoutId,
		...clearList,
		...clearListProcessing,
		...setSortValue,
		...changeEmbeddedFieldData,
		...setVisibleLoadingBlock,
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
