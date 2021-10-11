import Icon from 'components/elements/Icon'
import ImagePreview from 'components/elements/ImagePreview'
import React, { useState } from 'react'
import { colors } from 'theme/variables/platform'

const ImageItem = ({ file }) => {
  const [isShow, setIsShow] = useState(false)

  const onShowPreview = () => {
    setIsShow(true)
  }

  const onHidePreview = () => {
    setIsShow(false)
  }

  return (
    <>
      <div className="flex flex-row">
        <div onMouseEnter={onShowPreview} onMouseLeave={onHidePreview} className="cursor-pointer">
          <Icon name="image" style="w-10 h-10" fill={colors.font3} />
        </div>
        <p>{file.name}</p>
      </div>
      <ImagePreview file={file} isShow={isShow} />
    </>
  )
}

export default ImageItem
