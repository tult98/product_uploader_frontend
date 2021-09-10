import React from 'react'
import paths from 'components/elements/Icon/paths'

const Icon = ({ name, fill = '#000', viewBox = '0 0 24 24', style }) => {
  const svgStyles = paths[name]?.type === 'stroke' ? { stroke: fill, fill: 'none' } : { fill }
  return (
    <div className={style}>
      <svg width="100%" height="100%" viewBox={viewBox} style={svgStyles} xmlns="http://www.w3.org/2000/svg">
        {paths[name].path}
      </svg>
    </div>
  )
}

export default Icon
