import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { FC } from 'react'

dayjs.extend(relativeTime)

interface LastConnectedProps {
  lastConnected: number | null
}

export const LastConnected: FC<LastConnectedProps> = ({ lastConnected }) => {
  if (!lastConnected) {
    return <>Not yet connected</>
  }

  return <>{`Last connected ${dayjs(lastConnected * 1000).fromNow()}`}</>
}
