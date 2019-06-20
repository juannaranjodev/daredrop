import approveProject from 'root/src/shared/descriptions/recordClickActions/approveProject'
import rejectProject from 'root/src/shared/descriptions/recordClickActions/rejectProject'
import rejectActiveProject from 'root/src/shared/descriptions/recordClickActions/rejectActiveProject'
import approveDelivery from 'root/src/shared/descriptions/recordClickActions/approveDelivery'
import rejectDelivery from 'root/src/shared/descriptions/recordClickActions/rejectDelivery'

export default {
	...approveProject,
	...rejectProject,
	...rejectActiveProject,
	...approveDelivery,
	...rejectDelivery,
}
