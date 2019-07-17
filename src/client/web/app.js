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

import 'root/src/client/assets/favicon-16x16.png'
import 'root/src/client/assets/favicon-32x32.png'
import 'root/src/client/assets/favicon-48x48.png'
import 'root/src/client/assets/favicon.ico'

render(
	<Provider store={webStore}>
		<RouteRender />
	</Provider>,
	document.getElementById('app'),
)
