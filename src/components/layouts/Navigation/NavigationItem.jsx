import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from 'components/elements/Icon'
import { colors } from 'theme/variables/platform'

const NavigationItem = ({ name, route, child }) => {
  const [isExpand, setIsExpand] = useState(false)

  const onToggleNavigation = () => {
    setIsExpand(!isExpand)
  }

  return (
    <>
      {route && !child ? (
        <Link to={route} className="navigation-item">
          <Icon name={name} style="w-12 h-12 mr-4" fill={colors.white100} />
          {name}
        </Link>
      ) : (
        <>
          <div className="relative navigation-item " onClick={onToggleNavigation}>
            <Icon name={name} style="w-12 h-12 mr-4" fill={colors.white100} />
            {name}
            {!isExpand ? (
              <Icon name="chevronDown" style="w-8 h-8 absolute right-4" fill={colors.white100} />
            ) : (
              <Icon name="chevronUp" style="w-8 h-8 absolute right-4" fill={colors.white100} />
            )}
          </div>
          {isExpand && (
            <>
              {child.map((item) => (
                <Link to={item.route} key={item.name} className="navigation-item bg-font3">
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
