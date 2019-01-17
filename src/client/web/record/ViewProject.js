import { map, addIndex } from 'ramda'
import React, { memo } from 'react'

import Assignee from 'sls-aws/src/client/web/record/Assignee'
import Game from 'sls-aws/src/client/web/record/Game'

import RecordClickActionButton from 'sls-aws/src/client/web/base/RecordClickActionButton'
import { APPROVE_PROJECT } from 'sls-aws/src/shared/descriptions/recordClickActions/recordClickActionIds'

import viewProjectConnector from 'sls-aws/src/client/logic/project/connectors/viewProjectConnector'
import withModuleContext from 'sls-aws/src/client/util/withModuleContext'

import goToPledgeProjectHandler from 'sls-aws/src/client/logic/project/handlers/goToPledgeProjectHandler'

import { orNull } from 'sls-aws/src/shared/util/ramdaPlus'

import Button from '@material-ui/core/Button'

export const ViewProjectModule = memo(({
	projectId, projectDescription, projectTitle, pledgeAmount, myPledge, status,
	assignees, games, canApproveProject, pushRoute, canPledgeProject,
}) => (
	<div className="layout-column">
		<div>Project Status: {status}</div>
		<div>{ projectTitle }</div>
		<div>{ projectDescription }</div>
		<div>Pledge Amount: {pledgeAmount}</div>
		<div>My Pledge Amount: {myPledge}</div>
		{addIndex(map)((assignee, i) => (
			<Assignee key={i} {...assignee} />
		), assignees)}
		{addIndex(map)((game, i) => (
			<Game key={i} {...game} />
		), games)}
		{orNull(
			canApproveProject,
			<RecordClickActionButton
				recordClickActionId={APPROVE_PROJECT}
				recordId={projectId}
			/>,
		)}
		{orNull(
			canPledgeProject,
			<Button onClick={goToPledgeProjectHandler(projectId, pushRoute)}>
				Pledge
			</Button>,
		)}
	</div>
))

export default withModuleContext(viewProjectConnector(ViewProjectModule))