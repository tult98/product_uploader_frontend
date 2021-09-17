import React from 'react'
import Icon from 'components/elements/Icon'
import { colors } from 'theme/variables/platform'

const IntroducePage = ({ name, title, description }) => {
  return (
    <div className="flex flex-row">
      <div className="flex flex-row items-center justify-center w-24 h-24 rounded-full bg-lightGray">
        <Icon name={name} style="w-12 h-12" fill={colors.font1} />
      </div>
      <div className="ml-8">
        <p className="text-5xl font-bold text-font1">{title}</p>
        <p className="text-font2">{description}</p>
      </div>
    </div>
  )
}

export default IntroducePage
