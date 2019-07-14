import { map } from 'ramda'
import { dynamoItemsProp } from 'root/src/shared/descriptions/apiLenses'

export default ({ dynamoResults, serializer, next }) => ({
	next,
	items: map((item) => {
		if (serializer) {
			return serializer(item)
		}
		return item
	}, dynamoItemsProp(dynamoResults)),
})
