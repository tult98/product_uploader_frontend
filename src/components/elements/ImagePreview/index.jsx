import React, { useEffect, useState } from 'react'

const ImagePreview = ({ file, isShow }) => {
  const [imageData, setImageData] = useState(null)
  const reader = new FileReader()

  useEffect(() => {
    reader.readAsDataURL(file)
    reader.addEventListener('load', onPreviewImage)
    return () => reader.removeEventListener('load', onPreviewImage)
  }, [])

  const onPreviewImage = () => {
    setImageData(reader.result)
  }

  return (
    <>
      {isShow && (
        <div className="fixed z-50 w-1/3 transform -translate-y-1/2 top-1/2 left-1/2">
          <img src={imageData} className="object-contain border-2 border-blue-600" />
        </div>
      )}
    </>
  )
}

export default ImagePreview
