import { zipObj } from 'ramda'
import { moduleIdProp } from 'root/src/client/logic/route/lenses'
import formSchema from 'root/src/client/logic/form/selectors/formSchema'
import formData from 'root/src/client/logic/form/selectors/formData'

export default (state, props) => zipObj(
	['formData', 'formSchema', 'moduleId', 'moduleKey'],
	[formData(state, props), formSchema(state, props), moduleIdProp(props), props.moduleKey],
)
