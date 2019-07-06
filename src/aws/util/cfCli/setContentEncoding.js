import { contains } from 'ramda'

export default filename => (contains('.br.', filename) ? 'br' : 'gzip')
