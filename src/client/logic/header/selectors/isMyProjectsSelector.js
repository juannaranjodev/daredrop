import { prop, equals, compose, __ } from 'ramda'
import { MY_PROJECT_BANNER_HEADER_MODULE_ID } from 'root/src/shared/descriptions/modules/moduleIds'


export default (state, props) => compose(equals(__, MY_PROJECT_BANNER_HEADER_MODULE_ID), prop('moduleId'))(props)
