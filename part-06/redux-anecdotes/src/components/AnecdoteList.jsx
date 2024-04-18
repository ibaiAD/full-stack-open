import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const anecdotes = useSelector(
    ({ anecdotes, filter }) => {
      if (!filter) {
        return [...anecdotes].sort((a, b) => b.votes - a.votes)
      }

      return anecdotes
        .filter(({ content }) =>
          content.toLowerCase().includes(filter.toLowerCase())
        )
        .sort((a, b) => b.votes - a.votes)
    }
  )
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    const { id, content } = anecdote
    console.log('vote', id)
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`you voted '${content}'`, 10))
  }

  return (
    <>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote)}
        />
      )}
    </>
  )
}

export default AnecdoteList