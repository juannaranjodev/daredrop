import React from 'react'
import { TwitchButton } from 'root/src/client/web/base/CustomButton'
import { twitchOauthUrl } from 'root/src/shared/constants/twitch'
import { orNull, ternary } from 'root/src/shared/util/ramdaPlus'
import { storageSet } from 'root/src/shared/util/storage'
import goToDeliveryFormHandler from 'root/src/client/logic/project/handlers/goToDeliveryFormHandler'
import goToSignInHandler from 'root/src/client/logic/project/handlers/goToSignInHandler'
import ButtonSubtitle from 'root/src/client/web/base/CustomButton/buttonWithSubtitle'
import { propOr } from 'ramda'
import { notConnected, connectedNotClaimed, accepted, notEligible } from 'root/src/shared/constants/projectAcceptanceStatuses'
import goToClaimProjectHandler from 'root/src/client/logic/project/handlers/goToClaimProjectHandler'

const ClaimButton = ({ projectAcceptanceStatus, pushRoute, assignees, projectId, isAuthenticated }) => {
  switch (projectAcceptanceStatus || undefined) {
    case (notConnected):
      return (
        <TwitchButton
          title="Accept or reject Dare"
          subtitle="Connect with Twitch"
          withIcon
          onClick={
            ternary(isAuthenticated,
              () => {
                storageSet('redirectAssignees', JSON.stringify(assignees))
                storageSet('redirectUri', window.location.pathname)
              },
              goToSignInHandler(pushRoute))
          }
          href={orNull(isAuthenticated,
            twitchOauthUrl)}
        />
      )
    case (connectedNotClaimed):
      return (
        <TwitchButton
          title="Accept or reject Dare"
          onClick={goToClaimProjectHandler(
            projectId, pushRoute,
          )}
        />
      )
    case (accepted):
      return (
        <ButtonSubtitle
          title="Deliver Dare Video"
          subtitle="Upload to complete the Dare"
          onClick={goToDeliveryFormHandler(pushRoute, projectId)}
        />
      )
    case (notEligible):
      return null;
    default:
      
  }
}

export default ClaimButton
