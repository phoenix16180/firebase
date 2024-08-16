import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            const tasksCollection = collection(db, 'tasks');
            const tasksSnapshot = await getDocs(tasksCollection);
            const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTasks(tasksList);
        };

        fetchTasks();
    }, []);

    const addTask = async () => {
        const tasksCollection = collection(db, 'tasks');
        await addDoc(tasksCollection, { name: newTask });
        setNewTask('');
        // Re-fetch tasks
        const tasksSnapshot = await getDocs(tasksCollection);
        const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(tasksList);
    };

    const updateTask = async (id, updatedName) => {
        const taskDoc = doc(db, 'tasks', id);
        await updateDoc(taskDoc, { name: updatedName });
        // Re-fetch tasks
        const tasksSnapshot = await getDocs(collection(db, 'tasks'));
        const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(tasksList);
    };

    const deleteTask = async (id) => {
        const taskDoc = doc(db, 'tasks', id);
        await deleteDoc(taskDoc);
        // Re-fetch tasks
        const tasksSnapshot = await getDocs(collection(db, 'tasks'));
        const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(tasksList);
    };

    return (
        <div>
            <h1>Tasks</h1>
            <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={addTask}>Add Task</button>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {task.name}
                        <button onClick={() => updateTask(task.id, prompt('New name:', task.name))}>Update</button>
                        <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Tasks;