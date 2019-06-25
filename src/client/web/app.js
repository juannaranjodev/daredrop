import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
// css
import 'react-material-layout/dist/react-material-class-layout.min.css'
import 'root/src/client/web/app.css'
// static files hosting
import 'root/src/client/web/static/staticFiles'

import RouteRender from 'root/src/client/web/base/RouteRender'

import webStore from 'root/src/client/logic/web'

import 'root/src/client/assets/favicon.png'

render(
	<Provider store={webStore}>
		<RouteRender />
	</Provider>,
	document.getElementById('app'),
)
