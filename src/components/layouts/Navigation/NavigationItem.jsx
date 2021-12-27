import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from 'components/elements/Icon'
import { colors } from 'theme/variables/platform'

const NavigationItem = ({ name, route, child }) => {
  /* eslint-disable-next-line */
  const [isExpand, _] = useState(true)

  return (
    <>
      {route && !child ? (
        <Link to={route} className="navigation-item">
          <Icon name={name} style="w-12 h-12 mr-4" fill={colors.white100} />
          {name}
        </Link>
      ) : (
        <>
          <div className="relative navigation-item ">
            <Icon name={name} style="w-12 h-12 mr-4" fill={colors.white100} />
            {name}
          </div>
          {isExpand && (
            <>
              {child.map((item, index) => (
                <Link to={item.route} key={index} className="navigation-item bg-font3">
                  <p>{item.name}</p>
                </Link>
              ))}
            </>
          )}
        </>
      )}
    </>
  )
}

export default NavigationItem
