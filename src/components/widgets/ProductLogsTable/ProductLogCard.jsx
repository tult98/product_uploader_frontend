import React, { useCallback, useState } from 'react'
import LogCard from 'components/elements/LogCard'

const ProductLogCard = ({ index, productLog }) => {
  const [isShowChild, setIsShowChild] = useState(false)

  const onToggleShowChildren = useCallback(() => {
    setIsShowChild(!isShowChild)
  }, [isShowChild])

  return (
    <>
      <LogCard
        key={productLog.sku}
        index={index + 1}
        log={productLog}
        isParent={true}
        isShowChild={isShowChild}
        onToggleShowChildren={onToggleShowChildren}
      />
      {isShowChild && productLog.variations && productLog.variations.length > 0 && (
        <>
          {productLog.variations.map((variationLog, index) => (
            <LogCard key={variationLog.sku} index={index + 1} log={variationLog} />
          ))}
        </>
      )}
    </>
  )
}

export default ProductLogCard
