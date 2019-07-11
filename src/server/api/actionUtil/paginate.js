import { ternary } from 'root/src/shared/util/ramdaPlus'

export default (projects, pageLength) => ternary(
	projects.length % pageLength > 0,
	(Math.floor((projects.length + pageLength - 1) / pageLength)),
	Math.round(projects.length / pageLength),
)
