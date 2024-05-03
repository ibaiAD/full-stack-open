import { Box, Button } from '@mui/material'
import PropTypes from 'prop-types'
import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <Box>
      <Box sx={hideWhenVisible}>
        <Button variant="outlined" onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </Box>
      <Box sx={showWhenVisible}>
        <Button onClick={toggleVisibility} variant="outlined" color="error">
          cancel
        </Button>
      </Box>
      <Box sx={showWhenVisible}>{props.children}</Box>
    </Box>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

Togglable.displayName = 'Togglable'

export default Togglable
