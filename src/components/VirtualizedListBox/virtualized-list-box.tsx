import React, { forwardRef } from 'react'
import { Virtuoso } from 'react-virtuoso'

interface forwardRefProps {
  children: any
}

// eslint-disable-next-line react/display-name
export const VirtualizedListBox = forwardRef<HTMLDivElement, forwardRefProps>(({ children, ...rest }, ref) => {
  const items = React.Children.toArray(children)
  const itemCount = items.length
  const itemSize = 36
  const maxItems = 6

  const getHeight = () => {
    if (itemCount > maxItems) {
      return maxItems * itemSize
    }

    return itemCount * itemSize
  }

  return (
    <div ref={ref}>
      <Virtuoso
        data={items}
        style={{ height: getHeight() }}
        totalCount={itemCount}
        {...rest}
        itemContent={(index, data) => data}
      />
    </div>
  )
}) as React.ComponentType<React.HTMLAttributes<HTMLElement>>
