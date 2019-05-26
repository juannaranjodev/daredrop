export default (recordId, recordClickActionId, recordClickAction, payload) => () => (
	recordClickAction(recordClickActionId, recordId, payload)
)
