import React from 'react';
import { Meteor } from 'meteor/meteor';
import { ErrorAlert } from './components/ErrorAlert';
import { SuccessAlert } from './components/SuccessAlert';
import { StoriesCollection } from '../api/collections/StoriesCollection';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

export const Story = () => {
    const initialText = '\t';
    const [title, setTitle] = React.useState(''); 
    const [text, setText] = React.useState(initialText);
    const [published, setPublished] = React.useState();
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [newStory, setNewStory] = React.useState(true);
    const [storyId, setStoryId] = React.useState('new story');
    const [needStoryId, setNeedStoryId] = React.useState(false);
    const [unsavedChanges, setUnsavedChanges] = React.useState(false);
    const [cursorPosition, setCursorPosition] = React.useState(0);

    const showError = ({ message }) => {
      setError(message);
      setTimeout(() => {
        setError('');
      }, 5000);
      return true;
    };

      const showSuccess = ({ message }) => {
        setSuccess(message);
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      };
    
    const saveStory = () => {
      setError('');
      Meteor.call(
        'story.save',
        { storyId, title, text, published },
        (errorResponse) => {
          errorResponse ?
          showError({ message: errorResponse.reason}) :
          showSuccess({ message:"Story saved."})+
          setNeedStoryId(true)+
          setUnsavedChanges(false);
          ;
        }
    );
  }

  const isLoadingStories = useSubscribe('myStories');
  const storiesCursor = useFind(() => StoriesCollection.find({}));
  const helpMessage = "Select a story to edit, or select '* new story' to start a new one. When you're ready to make it public, click on the 'Publish Story' checkbox. Click on the 'Save Changes' button to save."
  
    return (
      <div className="items-center">
       <h3 className=" text-lg text-base font-medium">
        Write Stories 
      </h3>
      {(newStory ? 
        (setStoryId("new story")+
        setTitle("")+
        setText(initialText)+
        setPublished(false)+ 
        setNewStory(false)
        ):"")}
      {needStoryId ? 
        storiesCursor.map((story) => {
        if(story.title == title){
          setStoryId(story._id)+
          setNeedStoryId(false);
        }
      }) : ''}
      <div className='h-20'>
      {error ? <ErrorAlert message = {error} /> : <SuccessAlert message={success||helpMessage} />}
      </div>
      <form className="mt-1">
          <div className="col-span-6 sm:col-span-6 lg:col-span-2"> 
            <label
              htmlFor="select"
              className="block text-sm font-medium text-gray-700"
            >
              Select Story to Edit
            </label>
            <select
              id="select"
              value={title}
              onChange={(e) => {
                (unsavedChanges && (e.preventDefault() || 
                showError({message:'You have unsaved changes.'})
                )) ||
                setStoryId("") +
                setError("") +
                setSuccess("") +
                setNewStory(true)+
                storiesCursor.map((story) => {
                  (story.title == e.target.value) ? 
                  (setNewStory(false)+
                  setTitle(story.title)+
                  setText(story.text)+
                  setPublished(story.published)+
                  setStoryId(story._id)
                  ): ""}) 
                }}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option key = ""> * new story </option>
              {storiesCursor.map((story) => (
                <option key = {story._id}>
                  {story.title}
                </option>
              ))}
              </select>
          </div>
  
          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title of Story
            </label>
            <input
              id="title"
              value={title}
              onInput={(e) => {
                setUnsavedChanges(true);
              }}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              wrap="soft"
/>
         </div> 

        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <label
              htmlFor="text"
              className="block text-sm font-medium text-gray-700"
            >
              Text of Story - Use shift-enter instead of enter for new paragraph.
            </label>
            <textarea
              id="text"
              value={text}
              onKeyDown = {(e) => {
              return (e.key == 'Enter') ? 
              'foo'===((setText(text.slice(0,e.target.selectionStart) +
               '\n\t' + 
               text.slice(e.target.selectionStart))) +
               setCursorPosition( e.target.selectionStart + 2) +
               e.preventDefault() +
               (e.target.selectionEnd = e.target.selectionStart = cursorPosition))  : 
               null
              }}
              onInput={(e) => {
                setUnsavedChanges(true);
              }}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              wrap="soft"
              rows="8"
/>
         </div> 
    
         <div className="">
            <input
              type = "checkbox"
              id="publish"
              checked={published}
              onChange={(e) => setPublished(e.target.checked) +
                setUnsavedChanges(true)}
              className=""
              wrap="soft"
            />
            <label
              htmlFor="publish"
              className="px-1 text-sm font-medium text-gray-700"
            >
              Publish Story
            </label>
         </div> 

     <div className="px-2 py-3 ">
          <button 
            type="button"
            onClick={saveStory}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:bg-orange-900"
            autoFocus
          >
            Save Changes
          </button>
        </div> 

      </form>
</div> 
);}