import React from 'react'
import Icon from 'components/elements/Icon'
import { colors } from 'theme/variables/platform'
import { UPLOAD_STATUS } from 'utils/productUtils'

const LogCard = ({ index, log, isParent, isShowChild, onToggleShowChildren }) => {
  const textStyle =
    log.status === UPLOAD_STATUS.SUCCESS
      ? 'text-green-600'
      : log.status === UPLOAD_STATUS.WARN
      ? 'text-yellow-600'
      : 'text-red-500'
  const bgStyle = index % 2 !== 0 ? 'bg-white' : 'bg-gray-200'
  return (
    <div
      className={`grid items-center w-full grid-cols-12 col-span-12 capitalize ${isParent ? bgStyle : 'bg-gray-100'}`}
    >
      {isParent && log.variations && log.variations.length > 0 && (
        <div
          className={`absolute ml-4 cursor-pointer ${
            isShowChild ? 'transform rotate-90 duration-300' : 'transform rotate-0 duration-300'
          }`}
          onClick={onToggleShowChildren}
        >
          <Icon name="chevronRight" style="w-10 h-10" fill={colors.darkGray} />
        </div>
      )}
      <div className={`flex px-4 py-4 ${textStyle}`}>{isParent ? index : ''}</div>
      <div className={`flex px-4 col-span-1 py-4 ${textStyle}`}>{log.status}</div>
      <div className={`flex px-4 col-span-4 py-4 ${textStyle}`}>{log.sku}</div>
      <div className={`flex px-4 col-span-6 py-4 ${textStyle}`}>{log.message}</div>
    </div>
  )
}

export default LogCard
