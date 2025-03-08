'use client'

import { useState } from 'react'
import { Button, Menu, MenuItem } from '@mui/material'
import { KeyboardArrowDown } from '@mui/icons-material'

interface FilterDropdownProps {
  label: string
  options: string[]
}

export default function FilterDropdown({ label, options }: FilterDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedOption, setSelectedOption] = useState(options[0])
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  
  const handleClose = () => {
    setAnchorEl(null)
  }
  
  const handleSelect = (option: string) => {
    setSelectedOption(option)
    handleClose()
  }
  
  return (
    <div>
      <Button
        variant="outlined"
        endIcon={<KeyboardArrowDown />}
        onClick={handleClick}
        size="small"
      >
        {label}: {selectedOption}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option) => (
          <MenuItem 
            key={option} 
            onClick={() => handleSelect(option)}
            selected={option === selectedOption}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}