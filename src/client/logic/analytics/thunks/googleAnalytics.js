import ReactGA from 'react-ga'

export default () => {
	ReactGA.initialize(process.env.GOOGLE_TAG)
	ReactGA.plugin.require('ecommerce', { debug: true })
	ReactGA.pageview(window.location.pathname + window.location.search)
}

export const googleAnalytics = ReactGA
