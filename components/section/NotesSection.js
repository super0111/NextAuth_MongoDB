import { useEffect, useState } from "react"
import axios from "axios";
import {
    QuestionMarkCircleIcon,
  } from '@heroicons/react/solid'
import dateformat from 'dateformat';

export default function NotesSection(props) {
    const {id} = props;
    const [deviceNotes, setDeviceNotes] = useState(null)
    const [noteValues, setNoteValues] = useState({
       title:'',
       description:'',
       deviceId: id
    });
    const createNote = async(e) => {
        e.preventDefault()
        await axios.post('/api/notes',{
            title: noteValues.title,
            description: noteValues.description,
            deviceId: id
        }).catch((err) => console.log('Get Notes Err', err))
        getNotes()
    }
    const noteChangeHandler = e => {
        setNoteValues( prevValues => {
        return { ...prevValues,[e.target.name]: e.target.value}
        })
    }
    useEffect(() => {
        getNotes()
    }, [])
    const getNotes = async() => {
       const res =  await axios.get(`/api/notes/?id=${id}`)
            .catch((err) => console.log('Get Notes Err', err))
        setDeviceNotes(res.data.notes)
        // console.log('res', res)
    }
    return (
        <div>
             <section aria-labelledby="notes-title">
                <div className="bg-white shadow sm:rounded-lg sm:overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    <div className="px-4 py-5 sm:px-6">
                      <h2 id="notes-title" className="text-lg font-medium text-gray-900">
                        Notes
                      </h2>
                    </div>
                    <div className="px-4 py-6 sm:px-6">
                      <ul role="list" className="space-y-8">
                        {deviceNotes && deviceNotes.map((note) => (
                          <li key={note._id}>
                            <div className="flex space-x-3">
                              <div className="flex-shrink-0">
                                {/* <img
                                  className="h-10 w-10 rounded-full"
                                  src={`https://images.unsplash.com/photo-${comment.imageId}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                                  alt=""
                                /> */}
                              </div>
                              <div>
                                <div className="text-sm">
                                  <a href="#" className="font-medium text-gray-900">
                                    {note.title}
                                  </a>
                                </div>
                                <div className="mt-1 text-sm text-gray-700">
                                  <p>{note.description}</p>
                                </div>
                                <div className="mt-2 text-sm space-x-2">
                                  <span className={dateformat(note.createdAt, "DDDD mm/dd/yyyy HH:mm:ss ").includes("Today") ? "text-red-500 font-medium" : dateformat(note.createdAt, "DDDD mm/dd/yyyy HH:mm:ss ").includes("Yesterday") ?  "text-orange-500 font-medium" :  "text-indigo-500 font-medium" }>{dateformat(note.createdAt, "DDDD mm/dd/yyyy HH:mm:ss ")}</span>{' '}
                                  <span className="text-gray-500 font-medium">&middot;</span>{' '}
                                  {/* <button type="button" className="text-gray-900 font-medium">
                                    Reply
                                  </button> */}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-6 sm:px-6">
                    <div className="flex space-x-3">
                      {/* <div className="flex-shrink-0">
                        <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                      </div> */}
                      <div className="min-w-0 flex-1">
                        <form action="#">
                          <div>
                            <label htmlFor="comment" className="sr-only">
                              Title
                            </label>
                            <textarea
                              id="comment"
                              name="title"
                              rows={1}
                              onChange={noteChangeHandler}
                              className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                              placeholder="Add Title"
                              defaultValue={''}
                            />
                          </div>
                          <div className="mt-2">
                            <label htmlFor="comment" className="sr-only">
                              Description
                            </label>
                            <textarea
                              id="comment"
                              name="description"
                              rows={3}
                              onChange={noteChangeHandler}
                              className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                              placeholder="Add Description"
                              defaultValue={''}
                            />
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <a
                              href="#"
                              className="group inline-flex items-start text-sm space-x-2 text-gray-500 hover:text-gray-900"
                            >
                              <QuestionMarkCircleIcon
                                className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              <span>Add Notes</span>
                            </a>
                            <button
                              type="submit"
                              onClick={(e)=>createNote(e)}
                              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Comment
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            
        </div>
    )
}
