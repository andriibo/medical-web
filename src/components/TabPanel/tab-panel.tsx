import React, { FC } from 'react'

interface TabPanelProps {
  children?: React.ReactNode
  activeTab: string
  value: number | string
  className?: string
  ref?: React.RefObject<HTMLDivElement>
}

export const TabPanel: FC<TabPanelProps> = ({ children, value, activeTab, ...other }) => (
  <div
    aria-labelledby={`tab-${value}`}
    hidden={value !== activeTab}
    id={`tabpanel-${value}`}
    role="tabpanel"
    {...other}
  >
    {value === activeTab && children}
  </div>
)
