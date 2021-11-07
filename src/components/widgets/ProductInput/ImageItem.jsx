import React, { useState, useEffect } from 'react'
import ImagePreview from 'components/elements/ImagePreview'

const ImageItem = ({ file }) => {
  const [imageData, setImageData] = useState(null)
  const [isShow, setIsShow] = useState(false)
  const reader = new FileReader()

  useEffect(() => {
    reader.readAsDataURL(file)
    setImageData(reader.result)
    reader.addEventListener('load', onPreviewImage)
    return () => reader.removeEventListener('load', onPreviewImage)
  }, [])

  const onPreviewImage = () => {
    setImageData(reader.result)
  }

  const onShowPreview = () => {
    setIsShow(true)
  }

  const onHidePreview = () => {
    setIsShow(false)
  }

  return (
    <>
      <div className="flex flex-row items-center">
        <div onMouseEnter={onShowPreview} onMouseLeave={onHidePreview} className="cursor-pointer">
          <img src={imageData} alt="thumbnail-image" className="w-10 h-10 object-contain border border-gray-300 mr-2" />
        </div>
        <p>{file.name}</p>
      </div>
      <ImagePreview file={file} isShow={isShow} />
    </>
  )
}

export default ImageItem
