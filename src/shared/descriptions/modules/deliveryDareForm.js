import { DELIVERY_DARE_FORM_MODULE_ID } from 'root/src/shared/descriptions/modules/moduleIds'

import deliveryDareVideoSchema from 'root/src/shared/descriptions/formSchemas/deliveryDareVideoSchema'

export default {
	[DELIVERY_DARE_FORM_MODULE_ID]: {
		moduleType: 'form',
		title: 'Deliver Dare Video',
		schema: deliveryDareVideoSchema,
		fields: [
			{
				fieldId: 'videoURL',
				inputType: 'text',
				placeholder: 'Enter link',
				labelFieldText: [
					{
						text: 'Video URL',
						required: true,
					},
				],
			},
			{
				fieldId: 'videoAttach',
				inputType: 'attachmentInput',
				subTextLabel: 'We host the video for your fans',
				labelFieldText: [
					{
						text: 'Video Attachment',
						required: true,
					},
				],
			},
			{
				fieldId: 'timeStamp',
				inputType: 'timeStamp',
				subTextLabel: 'Time in the video when you begin to deliver on this dare',
				labelFieldText: [
					{
						text: 'Time Dare Completion Begins',
						required: true,
					},
				],
			},
		],
		submits: [
			{
				label: 'Confirm',
				uploadProgress: true,
			},
		],
	},
}
