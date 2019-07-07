import { apiStoreLenses } from 'root/src/client/logic/api/lenses'

const { viewUserData } = apiStoreLenses

export default state => viewUserData(state) || {}
