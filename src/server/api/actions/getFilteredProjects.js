import { intersection } from 'ramda'
import getFilteredProjectsByGame from 'root/src/server/api/actions/getFilteredProjectsByGame'
import getFilteredProjectsByStreamer from 'root/src/server/api/actions/getFilteredProjectsByStreamer'

export default async ( payload ) => {
    let filteredProjects = null
    if (payload.payload.gameId){
        filteredProjects = await getFilteredProjectsByGame(payload)
    }
    if (payload.payload.streamerId){
        const filteredProjectssByStreamer = await getFilteredProjectsByStreamer(payload)
        if(payload.payload.gameId){
            filteredProjects.items = intersection(filteredProjects.items,filteredProjectssByStreamer)
        }else{
            filteredProjects = filteredProjectssByStreamer
        }
    }
    return filteredProjects
}
