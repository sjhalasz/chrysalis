import { Meteor } from 'meteor/meteor';
import React, { memo } from 'react';
import { StoriesCollection } from '../api/collections/StoriesCollection';
import { CommentsCollection } from '../api/collections/CommentsCollection';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { Loading } from './components/Loading';
import { useLoggedUser } from 'meteor/quave:logged-user-react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

{/* Create a list of stories from all users in which the stories are  */}
{/*   flagged as 'published'. The viewer can scroll through the stories  */}
{/*   using 'Previous' and 'Next' buttons. Logged-on users can also   */}
{/*   add comments. */} 
export const StoriesList = () => {
  {/* The 'allStories' Meteor publication allows the retrieval of  */}
  {/*   stories from any user where the story is flagged as 'published' */}
  const isLoadingAllStories = useSubscribe('allStories');
  const isLoadingAllComments = useSubscribe('allComments');
  const isLoading = isLoadingAllStories || isLoadingAllComments; 
  {/* These React variables are used when paging through stories.  */}
  {/*   currentKey is set to the createdAt timestamp of the currently */}
  {/*   displayed story when the Previous or Next button is clicked.*/}
  {/*   It starts as the current timestamp so that the first story */}
  {/*   will be the newest story that is before the current moment.*/}
  const [currentKey, setCurrentKey] = React.useState(new Date());
  {/*   The direction variable is -1 for 'Next' and 1 for 'Previous'*/}
  const [direction, setDirection] = React.useState(-1);
  const { loggedUser, isLoadingLoggedUser } = useLoggedUser();

  {/* nextStory is called when the 'Next' button is clicked.  */}
  {/*   It sets direction to -1 to indicate reverse sort, and */}
  {/*   sets currentKey to be the createdAt timestamp of the */}
  {/*   currently-displayed story. Because these variables are */}
  {/*   handled by React, this causes the story retrieval routine */}
  {/*   to be re-run.*/}

  const nextStory = () => {
    setDirection(-1);
    setCurrentKey(story.createdAt);
  }

  {/*Likewise for the 'Previous' button.   */}

  const previousStory = () => {
    setDirection(1);
    setCurrentKey(story.createdAt);
  }
  
  {/* StoryItem formats the story. It displays the user name and the title. */}
  {/*   It then displays the story text underneath. In future it will also*/}
  {/*   display the comments and allow posting comments.*/}

  const StoryItem = ({ story }) => (
    <>
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-medium text-gray-900">
          {story.title}
        </p>
        <div className="flex-shrink-0">
          by &nbsp;
          <Link
          className='underline hover:font-bold' 
          to={"/stories/" + story.userId}
          >
            {story.userName}
          </Link>
        </div>

        </div>
          {/* The story text is displayed in a <pre> so that the  */}
          {/*   newlines are shown as entered by the author,*/}
          <pre className="text-sm font-medium text-gray-500">
            {/* The replace here does a word wrap within 42 characters.  */}
            {/*   With <pre> there is otherwise no word wrap. */}
            {"\n" + story.text.replace(/(?![^\n]{1,42}$)([^\n]{1,42})\s/g, '$1\n')}
          </pre>
  </>
  );

  const CommentsList = ({story}) => (
    <>
          <hr className=" h-1 my-4 bg-gray-200 border-0 rounded dark:bg-gray-700"/>
          Comments: 
          
          {!isLoadingLoggedUser && loggedUser && (
          <><br/>Type a comment in the box and press enter to save it.
          <input
              className = "mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              onKeyDown = {(e) => {
                return (e.key == 'Enter') 
                /* The 'foo'=== forces return of false.*/
                ?'foo'===(
                  Meteor.call('comments.save'
                  , {commentId:'', storyId:story._id, parentId:'', text:e.target.value}
                  , (errorResponse) => {
                })
                + e.preventDefault()
                + (e.target.value = '') 
                )  
                : null
              }}
            />
            </>
            )}
            {useFind(() => CommentsCollection.find(
              {storyId: story._id}
              ,{sort:{createdAt: -1}}
            )).map((doc) => (<><br/><span className="font-bold">{doc.userName}:</span> {doc.text}</>))}
          
    </>
  );

  {/* When the page is loading. give an appropriate message.  */}
  if (isLoading()) {
    return <Loading />;
  }
  else {
  {/* Otherwise, load the story.  */}
  {/* In case there are no published stories... */}
  previousExists = nextExists = false;
  story = {_id:'', userName:'', title:'', text:''};
  query = {published: true };
  if(useParams()._id){
    query.userId = useParams()._id;
  }
  {/* When the page first loads, or when Next is clicked, direction is set to -1.  */}
  if(direction == -1){
    {/* Get a cursor pointing to the next two stories.  */}
    {/* currentKey is initially the current moment, or, when Next is clicked,  */}
    {/*   the createdAt timestamp of the currently-displayed story. */}
    {/*   With reverse sorting, from latest to earliest, we want the next */}
    {/*   two stories that are earlier than the current story.  */}
    query.createdAt = {$lt: currentKey};
    next = StoriesCollection.find(query,{sort:{createdAt: -1}, limit: 2}).fetch();
    {/* If there are two, there is another earlier one   */}
    {/*   so the Next button will be enabled. */}  
    nextExists = ( next.length > 1);
    if(next.length > 0){
      {/* Retrieve the next earlier story from the cursor.  */}
      story = next[0];
      {/* Check if there's a previous (older) story. */}
      {/*   This is necessary to disable the Previous button when the*/}
      {/*   page is first loaded.*/}
      {/*   With ascending sort, earliest to latest story,*/}
      {/*   find the next story that is later than the story*/}
      {/*   we just retrieved.*/}
      query.createdAt = {$gt: story.createdAt};
      previous = StoriesCollection.find(query, {sort:{createdAt: 1}, limit: 1}).fetch();
      { /* We will enable the Previous button if one exists.  */}
      previousExists = (previous.length > 0) ;
    }
  }

  else {
    {/* Otherwise, the Previous button was clicked.  */}
    {/*   Get a cursor with ascending sort, earliest to latest,*/}
    {/*   with createdAt greater than the story that was displayed */}
    {/*   when Previous was clicked. */}
    query.createdAt = {$gt: currentKey};

    previous = StoriesCollection.find(query,{sort:{createdAt: 1}, limit: 2}).fetch();
    {/* We will enable the Previous button if there are at least 2,  */}
    {/*   the one we are about to display and another one. */}
    previousExists = (previous.length > 1) ;
    {/* There is always a next if we got here by clicking Previous.  */}
    nextExists = true;
    {/* Get the story to display  */}
    if(previous.length > 0) story = previous[0];
  }
  
  {/* This is the HTML to return to the page.  */}
  return (
    <div>
           <div className="px-2 py-3 ">
             {/* The Previous button.  */}
             {/* Note that React has a hack that treats   */}
             {/*   disabled={true/false} by including 'disabled' */}
             {/*   if true and omitting it if false. */}
             <button 
               type="button" 
               onClick={previousStory}
               className="disabled:opacity-50 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:bg-orange-900"
               disabled={!previousExists}
             >
               Previous Story  
             </button>
             
             {/* The Next button.  */}
             <button 
               type="button"
               onClick={nextStory}
               className="disabled:opacity-50 ml-2 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:bg-orange-900"
               autoFocus
               disabled={!nextExists}
             >
               Next Story
             </button>
           </div> 
           {/* Display the story. It is intentionally not handled  */}
           {/*   by React because we don't want the story to change */}
           {/*   or disappear while someone is reading it. */}
           <div className="flex min-w-0 flex-1 items-center space-x-3">
        </div>
          <StoryItem story = {story} />
          <CommentsList story = {story}/>
   </div>
    );
  }
}