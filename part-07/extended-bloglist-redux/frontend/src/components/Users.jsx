import { useSelector } from 'react-redux'

const Users = () => {
  const users = useSelector((state) => {
    return [...state.users].sort((a, b) => b.blogs?.length - a.blogs?.length)
  })

  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.username}>
              <td>{user.name}</td>
              <td>{user.blogs?.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Users
