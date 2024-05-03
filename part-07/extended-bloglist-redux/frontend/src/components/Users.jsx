import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Users = () => {
  const users = useSelector((state) => {
    return [...state.users].sort((a, b) => b.blogs?.length - a.blogs?.length)
  })

  return (
    <>
      <Typography component="h3" variant="h4">
        Users
      </Typography>
      <TableContainer component={Paper} elevation={2} sx={{ my: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                blogs created
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell align="right">{user.blogs?.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Users
