import { ternary } from 'root/src/shared/util/ramdaPlus'

export default (projects, pageLength) => ternary(
	projects.length % pageLength > 0,
	(Math.round(projects.length / pageLength) + 1),
	Math.round(projects.length / pageLength),
)
