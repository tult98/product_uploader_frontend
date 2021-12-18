import React, { useRef } from 'react'
import Icon from 'components/elements/Icon'
import { colors } from 'theme/variables/platform'
import { handleFileUploadData } from 'utils/productUtils'
import { validateFileType } from 'utils/validators'
import { AlertError } from 'utils/AlertUtils'

const ALLOW_IMAGE_TYPES = ['image/jpeg', 'image/gif']

const FileUploadInput = ({ setProducts }) => {
  const inputFile = useRef(null)
  // const inputArea = useRef(null)

  const onUploadFile = () => {
    inputFile.current.click()
  }

  // useEffect(() => {
  //   inputArea.current.addEventListener('dragover', onDragOver)
  //   inputArea.current.addEventListener('drop', onDrop)

  //   return () => {
  //     inputArea.current.removeEventListener('dragover', onDragOver)
  //     inputArea.current.removeEventListener('drop', onDrop)
  //   }
  // }, [products])

  // const onDragOver = (e) => {
  //   e.preventDefault()
  // }

  // const onDrop = async (e) => {
  //   e.preventDefault()

  //   const items = e.dataTransfer.items
  //   for (const item of items) {
  //     // webkitGetAsEntry is where the magic happens
  //     const selectedItem = item.webkitGetAsEntry()
  //     if (selectedItem && selectedItem.isDirectory) {
  //       traverseFileTree(selectedItem).then((res) => {
  //         if (res !== {}) {
  //           const productData = handleFileUploadData(res)
  //           setProducts([productData, ...products])
  //         }
  //       })
  //     } else {
  //       AlertError('Only support uploading folder')
  //     }
  //   }
  // }

  const onChangeFiles = (event) => {
    if (event.target.files.length === 0) {
      return
    }
    if (!AlertError(validateFileType(event.target.files))) {
      // TODO: handle all the files into different product data
      const filteredFiles = Object.values(event.target.files).filter((file) => ALLOW_IMAGE_TYPES.includes(file.type))
      const products = handleFileUploadData(filteredFiles)
      setProducts(products)
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center px-12 py-16 mt-10 transform bg-gray-200 cursor-pointer text-font1 rounded-3xl shadow-grayShadow"
      onClick={onUploadFile}
      // ref={inputArea}
    >
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: 'none' }}
        directory=""
        webkitdirectory=""
        onChange={onChangeFiles}
      />
      <Icon name="upload" style="w-12 h-12" fill={colors.font3} />
      <p className="mt-3 ml-2 text-2xl font-medium uppercase text-font3">
        Drag & Drop folders here or click to select folders
      </p>
    </div>
  )
}

export default FileUploadInput
