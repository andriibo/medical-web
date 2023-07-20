import React, { FC } from 'react'

interface TabPanelProps {
  children?: React.ReactNode
  activeTab: string
  value: number | string
  className?: string
  ref?: React.RefObject<HTMLDivElement>
}

export const TabPanel: FC<TabPanelProps> = ({ children, value, activeTab, className = '', ...other }) => {
  if (value !== activeTab) {
    return null
  }

  return (
    <div
      aria-labelledby={`tab-${value}`}
      className={`tab-panel ${className}`}
      hidden={value !== activeTab}
      id={`tabpanel-${value}`}
      role="tabpanel"
      {...other}
    >
      {children}
    </div>
  )
}
