import React from 'react';
import { Meteor } from 'meteor/meteor';
import { ErrorAlert } from './components/ErrorAlert';
import { SuccessAlert } from './components/SuccessAlert';
import { StoriesCollection } from '../api/collections/StoriesCollection';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker' 

{/* This enables a logged-in user to write and edit stories.  */}
export const Story = () => {
    {/* initialText is what an empty story text starts with.  */}
    {/*   We will use newline + tab when Enter is pressed, */}
    {/*   but this will give first line indent of first paragraph. */}
    const initialText = '\t';
    {/* These are the React variables for story data.  */}
    const [title, setTitle] = React.useState(''); 
    const [text, setText] = React.useState(initialText);
    const [published, setPublished] = React.useState();
    {/* These are used to display messages to the user.  */}
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    {/* When the user selects to start a new story, this is true.  */}
    const [newStory, setNewStory] = React.useState(true);
    {/* The id of the currently displayed story.  */}
    const [storyId, setStoryId] = React.useState('new story');
    {/* When a new story is saved for the first time,  */}
    {/*   this is set to true so the story id will be read in after. */}
    const [needStoryId, setNeedStoryId] = React.useState(false);
    {/* This is set to true when there are unsaved changes,  */}
    {/*   and will be used to warn the user when navigating away.  */}
    const [unsavedChanges, setUnsavedChanges] = React.useState(false);
    {/* We will be handling the Enter key by inserting tab after it.  */}
    {/*   This is needed to preserve the position of the cursor in that case. */}
    const [cursorPosition, setCursorPosition] = React.useState(0);
    const [waitingForGPT, setWaitingForGPT] = React.useState(false);
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
      Meteor.call('story.aiassist'
      , {storyId, text}
      , (errorResponse) => {
        console.log(errorResponse);
      });
      setWaitingForGPT(true);
      setError("Please wait...");
    }

    {/* saveStory is called when the Save Story button is clicked.  */}
    const saveStory = () => {
      {/* Clear any extant messages.  */}
      setError('');
      setSuccess('');
      {/* Call the Meteor method to save the story.  */}
      {/*   The method will update the document for existing storyId */}
      {/*   or insert a new document if storyId does not exist. */}
      {/*   needStoryId is set to true in case it was a new story. */}
      {/*   unsavedChanges is set to false because changes were saved. */}
      Meteor.call(
        'story.save',
        { storyId, title, text, published },
        (errorResponse) => {
          errorResponse ?
          showError({ message: errorResponse.reason}) :
          showSuccess({ message:"Story saved."})+
          setNeedStoryId(true)+
          setUnsavedChanges(false);
        }
      );
    }

    {/* The myStories publication returns all stories owned by  */}
    {/*   the currently logged-in user. */}

    const isLoadingStories = useSubscribe('myStories');
    {/* Get a cursor over all stories owned by this user.  */}
    const storiesCursor = useFind(() => StoriesCollection.find({}));
    {/* Help message for this page.  */}
    const helpMessage = "Select a story to edit, or select '* new story' to start a new one. When you're ready to make it public, click on the 'Publish Story' checkbox. Click on the 'Save Changes' button to save."
    {/* When AI Assist is used, the result of calling GPT is stored in */}
    {/* MongoDB. This will refresh the text control in that case. */}
    if(waitingForGPT){
      storiesCursor.map((story) => {
      /* If the current story is found in MongoDB... */
      if(story._id == storyId){
        if(story.gotGPT){
        /* ... set the text from MongoDB */
          setText(story.textGPT);
          /* ... and turn off the trigger. */
          setWaitingForGPT(false);
          /* Turn off the wait message */
          setError("");
          /* Set story.gotGPT to false. */
          Meteor.call('story.resetGotGPT',
          { storyId },
          (errorResponse) => {
            errorResponse ?
            showError({ message: errorResponse.reason}) : ''
          }
        );
          }
    }});
  }

    {/* Return HTML for creating/editing stories.  */}
    return (
      <div className="items-center">
       <h3 className=" text-lg text-base font-medium">
        Write Stories 
      </h3>
      {/* newStory is a toggle that is set true when the user   */}
      {/*   first selects to add a new story. A blank new story */}
      {/*   is initialized, then the toggle is turned off. */}
      {(newStory ? 
        (setStoryId("new story")+
        setTitle("")+
        setText(initialText)+
        setPublished(false)+ 
        setNewStory(false)
        ):"")}
      {/* needStoryId is a toggle set to true when a new story is saved.  */}
      {/*   The storyId is read from the database, then the toggle */}
      {/*   is turned off.*/}
      {needStoryId ? 
        storiesCursor.map((story) => {
          if(story.title == title){
            setStoryId(story._id)+
            setNeedStoryId(false);
          }
        }) : ''}
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
              Select Story to Edit
            </label>
            {/* The value is equal to the title.  */}
            {/*   On change, if unsaved changes, ignore selection */}
            {/*   and give and error message.*/}
            {/*   Otherwise, clear errors and storyId and */}
            {/*   loop through all user's stories until you find*/}
            {/*   the one selected. It will be found unless the */}
            {/*   user selected new story, in which case*/}
            {/*   newStory will be true and storyId will be empty.*/}
            {/*   For other than new story, the title, text and */}
            {/*   published switch are set from the database. */}
            <select
              id="select"
              value={title}
              disabled = {waitingForGPT}
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
              {/* The first option is to create a new story. */}
              {/*   React requires a 'key' for options and lists.*/}
              <option key = ""> * new story </option>
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
          {/*   onKeyDown captures the Enter key and adds a tab after*/}
          {/*   The 'foo'=== forces return of false.*/}
          {/*   The cursorPosition captures the selectionStart*/}
          {/*   and then is used to set selectionStart and selectionEnd.*/}
          {/*   I don't know why this works but it does. */}

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <label
              htmlFor="text"
              className="block text-sm font-medium text-gray-700"
            >
              Text of Story - Enter adds a tab for paragraph indent.
            </label>
            <textarea
              id="text"
              value={text}
              disabled = {waitingForGPT}
              onKeyDown = {(e) => {
                return (e.key == 'Enter') 
                  ?'foo'===(
                    (setText(
                      text.slice(0,e.target.selectionStart) 
                      + '\n\t' 
                      + text.slice(e.target.selectionStart))
                    ) 
                    + setCursorPosition( e.target.selectionStart + 2) 
                    + e.preventDefault() 
                    + (e.target.selectionEnd = e.target.selectionStart = cursorPosition)
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
         {/* Checking this box causes story to be made public.  */}
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
            onClick={aiAssist}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:bg-orange-900"
            disabled = {waitingForGPT}
            >
            AI Assist
          </button>
        </div> 

         {/* The Save Story button.  */}
         <div className="px-2 py-3 ">
          <button 
            type="button"
            onClick={saveStory}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:bg-orange-900"
            autoFocus
            disabled = {waitingForGPT}
            >
            Save Changes
          </button>
        </div> 

      </form>
</div> 
);}