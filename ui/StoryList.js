import { Meteor } from 'meteor/meteor';
import React, { memo } from 'react';
import { StoriesCollection } from '../api/collections/StoriesCollection';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { Loading } from './components/Loading';
 
export const StoriesList = () => {
  const isLoading = useSubscribe('allStories');
  const [currentKey, setCurrentKey] = React.useState(new Date());
  const [direction, setDirection] = React.useState(-1);
 
  const nextStory = () => {
    setDirection(-1);
    setCurrentKey(story.createdAt);
  }
  const previousStory = () => {
    setDirection(1);
    setCurrentKey(story.createdAt);
  }

    const StoryItem = ({ story }) => (
    <>
      <div className="flex min-w-0 flex-1 items-center space-x-3">
          <div className="flex-shrink-0">
            {story.userName}:
          </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">
            {story.title}
          </p>
        </div>
        </div>
          <pre 
          className="text-sm font-medium text-gray-500">
            {'\t' + story.text.replace(/(?![^\n]{1,64}$)([^\n]{1,64})\s/g, '$1\n')}
          </pre>
    </>
  );

  if (isLoading()) {
    return <Loading />;
  }
  else
{
  if(direction == -1){
  next = StoriesCollection.find(
    {createdAt: {$lt: currentKey}}
    ,{sort:{createdAt: -1}, limit: 2}
  );
  nextExists = ( next.count() > 1);
  story = next.fetch()[0];
  var  previous = StoriesCollection.find(
      {createdAt: {$gt: story.createdAt}}
      ,{sort:{createdAt: 1}, limit: 2}
    );
  previousExists = (previous.count() > 0) ;
  }
  else {
    previous = StoriesCollection.find(
      {createdAt: {$gt: currentKey}}
      ,{sort:{createdAt: 1}, limit: 2}
    );
    previousExists = (previous.count() > 1) ;
    nextExists = true;
    story = previous.fetch()[0];
  }
  }

  return (
    <div>
           <div className="px-2 py-3 ">
          <button 
            type="button"
            onClick={previousStory}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:bg-orange-900"
            disabled={!previousExists}
>
            Previous Story
          </button>

          <button 
            type="button"
            onClick={nextStory}
            className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:bg-orange-900"
            autoFocus
            disabled={!nextExists}
          >
            Next Story
          </button>
        </div> 
        <StoryItem story = {story} 
         />
      
    </div>);
}