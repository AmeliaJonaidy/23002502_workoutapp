import { useState } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext()

  // State to handle editing form
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(workout.title)
  const [editedLoad, setEditedLoad] = useState(workout.load)
  const [editedReps, setEditedReps] = useState(workout.reps)

  const handleClick = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
      method: 'DELETE'
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({ type: 'DELETE_WORKOUT', payload: json })
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()

    const updatedWorkout = {
      title: editedTitle,
      load: editedLoad,
      reps: editedReps
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedWorkout),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({ type: 'UPDATE_WORKOUT', payload: json })
      setIsEditing(false)
    }
  }

  return (
    <div className="workout-details">
      {isEditing ? (
        <form onSubmit={handleEdit}>
          <label>Title:</label>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <label>Load (kg):</label>
          <input
            type="number"
            value={editedLoad}
            onChange={(e) => setEditedLoad(e.target.value)}
          />
          <label>Reps:</label>
          <input
            type="number"
            value={editedReps}
            onChange={(e) => setEditedReps(e.target.value)}
          />
          <button type="submit">Save Changes</button>
        </form>
      ) : (
        <>
          <h4>{workout.title}</h4>
          <p><strong>Load (kg): </strong>{workout.load}</p>
          <p><strong>Reps: </strong>{workout.reps}</p>
          <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
          <span className="material-symbols-outlined" onClick={handleClick}>🗑️</span>
          <button onClick={() => setIsEditing(true)}>Edit Workout ✏️</button>
        </>
      )}
    </div>
  )
}

export default WorkoutDetails
