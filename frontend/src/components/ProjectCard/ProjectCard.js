import { useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import { Logo } from '/src/components'
import { deleteProject } from '/src/services'
import { useProjectsStore } from '/src/stores'

import { CardContainer, CardImage, TypeBadge, CardDetail } from './projectCardStyle'
import { MoreVertical } from 'lucide-react'

const ProjectCard = ({ name, type, date, image, ...props }) => (
  <CardContainer {...props}>
    <CardImage $image={!!image}>
      {image ? <img src={image} alt="" /> : <Logo />}
      <TypeBadge>{type}</TypeBadge>
    </CardImage>
    <CardDetail>
      <strong>{name}</strong>
      <MoreVertical onClick={(e) => {
        e.stopPropagation()
        deleteProject(pid).then((res) => {
          console.log(res)
          deleteProjectFromStore(pid)
        }).catch((err) => {
          console.error(err)
        })

      }}/>
      {date && <span>{date instanceof dayjs ? dayjs().to(date) : date}</span>}
    </CardDetail>
  </CardContainer>
)

export default ProjectCard
