import React from 'react';
import { Meteor } from 'meteor/meteor';
import { ErrorAlert } from './components/ErrorAlert';
import { SuccessAlert } from './components/SuccessAlert';
import { StoriesCollection } from '../api/collections/StoriesCollection';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

{/* This enables a logged-in user to write and edit stories.  */}
export const Story = () => {
    {/* initialText is what an empty story text starts with.  */}
    const initialText = '';
    {/* These are the React variables for story data.  */}
    const [title, setTitle] = React.useState(''); 
    const [text, setText] = React.useState(initialText);
    const [published, setPublished] = React.useState();
    {/* These are used to display messages to the user.  */}
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    {/* The id of the currently displayed story.  */}
    const [storyId, setStoryId] = React.useState('new story');
    {/* This is set to true when there are unsaved changes,  */}
    {/*   and will be used to warn the user when navigating away.  */}
    const [unsavedChanges, setUnsavedChanges] = React.useState(false);
    {/* We will be handling the Enter key by inserting tab after it.  */}
    {/*   This is needed to preserve the position of the cursor in that case. */}
    const [cursorPosition, setCursorPosition] = React.useState(0);
    {/* This is the value of storyId for unsaved stories. */}
    const newStoryId = "new story";
    {/* Set to true so long as we're waiting for GPT to return. */}
    const [waitingForGPT, setWaitingForGPT] = React.useState(false);
    const newStoryTitle = "* new story";

    {/* Function to display an error message for 5 seconds.  */}
    const showError = ({ message }) => {
      setError(message);
      setTimeout(() => {
        setError('');
      }, 5000);
      return true;
    };

 {/* Function to display success message for 5 seconds.  */}
    const showSuccess = ({ message }) => {
      setSuccess(message);
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    };

    const aiAssist = (response) => {
      if(unsavedChanges){
        showError({message: "Please save changes before using AI Assist."})
      } else {
        Meteor.call('story.aiassist'
          , {text}
          , (error, response) => {
            if(error){showError(error);} 
            else {
              setText(response.trim());
              setError("");
              setUnsavedChanges(true);
            }
            setWaitingForGPT(false);
          });
        setError("Please wait. OpenAI GPT is writing your story!");
        setWaitingForGPT(true);
      }
    }

    const getStory = (newTitle) => {
      setError("");
      setSuccess("");
      setTitle("");
      setText(initialText)
      setPublished(false);
      storiesCursor.map((story) => {
        if(story.title == newTitle){
          setText(story.text);
          setTitle(story.title);
          setPublished(story.published);
          setStoryId(story._id);
        }
      })
    }
  
    const selectStory = (e) => {
      if(unsavedChanges){
        e.preventDefault;
        showError({message:'You have unsaved changes. Save or cancel them before continuing.'});
      } else {
        getStory(e.target.value);
      }
    }

      {/* saveStory is called when the Save Story button is clicked.  */}
    const saveStory = () => {
      {/* Clear any extant messages.  */}
      setError('');
      setSuccess('');
      {/* Call the Meteor method to save the story.  */}
      {/*   The method will update the document for existing storyId */}
      {/*   or insert a new document if storyId does not exist. */}
      {/*   unsavedChanges is set to false because changes were saved. */}
      Meteor.call(
        'story.save',
        { storyId, title, text, published },
        (error, response) => {
          if(error){
            showError({ message: error.reason}) 
          } else {
            setStoryId(response);
            setUnsavedChanges(false);
            showSuccess({ message:"Story saved."});
          }
        }
      );
    }

    const revertStory = () => {
        getStory(title);
        setUnsavedChanges(false);
        showSuccess({message: "Changes canceled."})
      }

    {/* The myStories publication returns all stories owned by  */}
    {/*   the currently logged-in user. */}
    const isLoadingStories = useSubscribe('myStories');
    {/* Get a cursor over all stories owned by this user.  */}
    const storiesCursor = useFind(() => StoriesCollection.find({},{sort:{createdAt: -1}}));
    {/* Help message for this page.  */}
    const helpMessage = "Young people are eager to hear your story "
      + "in order to learn from it. If you're not a good writer, "
      + "don't worry. Just write what you want to share "
      + "and use AI Assist to write the story for you.";

    {/* Return HTML for creating/editing stories.  */}
    return (
      <div className="items-center">
       <h3 className="text-center text-lg text-base font-medium">
        TELL YOUR STORY 
      </h3>
      <div className='h-20'>
      {/* Display an error message or success message or help message.  */}
      {error ? 
        <ErrorAlert message = {error} /> 
        : <SuccessAlert message={success||helpMessage} 
        />
      }
      </div>
      {/* The input form for selecting story and entering  */}
      {/*   title, text, and publish switch.*/}
      <form className="mt-1"      >

        {/* The select control. */}
          <div className="col-span-6 sm:col-span-6 lg:col-span-2"> 
            <label
              htmlFor="select"
              className="block text-sm font-medium text-gray-700"
            >
              Select story (edit or new)
            </label>
            {/* The value is equal to the title.  */}
            {/*   On change, if unsaved changes, ignore selection */}
            {/*   and give an error message.*/}
            {/*   For other than new story, the title, text and */}
            {/*   published switch are set from the database. */}
            <select
              id="select"
              value={title}
              disabled = {waitingForGPT}
              onChange={selectStory}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              {/* The first option is to create a new story. */}
              {/*   React requires a 'key' for options and lists.*/}
              <option key = ""> {newStoryTitle} </option>
              {/* Other options are taken from the title of user's stories.  */}
              {storiesCursor.map((story) => (
                <option key = {story._id}>
                  {story.title}
                </option>
              ))}
              </select>
          </div>

          {/* The Title control. onInput sets unsavedChanges to true. */}
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
              disabled = {waitingForGPT}
              onInput={(e) => {
                setUnsavedChanges(true);
              }}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              wrap="soft"
            />
          </div> 

          {/* The text control.   */}
          {}
          {}

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <label
              htmlFor="text"
              className="block text-sm font-medium text-gray-700"
            >
              Text of Story &nbsp;
         {/* This button calls OpenAI GPT to enhance the story.  */}
          <button 
            type="button"
            onClick={aiAssist}
            className="px-1 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:bg-orange-900"
            disabled = {waitingForGPT}
            >
            AI Assist
          </button>
          &nbsp;
            {/* Checking this box causes story to be made public.  */}
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
              Publish
            </label>
   </label>
          <textarea
              id="text"
              value={text}
              disabled = {waitingForGPT}
              /* onKeyDown captures the Enter key and adds an extra newline. */   
              onKeyDown = {(e) => {
                return (e.key == 'Enter') 
                  /* The 'foo'=== forces return of false.*/
                  ?'foo'===(
                    (setText(
                      text.slice(0,e.target.selectionStart) 
                      + '\n\n' 
                      + text.slice(e.target.selectionStart))
                    ) 
                    /* cursorPosition captures the selectionStart*/
                    /* and then is used to set selectionStart and selectionEnd.*/
                    /* I don't know why this works but it does. */
                    + setCursorPosition( e.target.selectionStart + 2) 
                    + e.preventDefault() 
                    + (e.target.selectionEnd = e.target.selectionStart = cursorPosition)
                    + setUnsavedChanges(true)
                  )  
                  : null
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
   
    
         
         {/* The Save Story button.  */}
         <div className="py-1 ">
          <button 
            type="button"
            onClick={saveStory}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:bg-orange-900 disabled:bg-slate-300"
            autoFocus
            disabled = {waitingForGPT || !unsavedChanges}
            >
            Save Changes
          </button>
          &nbsp;
          <button 
            type="button"
            onClick={revertStory}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:bg-orange-900 disabled:bg-slate-300"
            autoFocus
            disabled = {waitingForGPT || !unsavedChanges}
            >
            Cancel Changes
          </button>
        </div> 

      </form>
</div> 
);}