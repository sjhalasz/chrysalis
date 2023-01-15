import { Meteor } from 'meteor/meteor';
import React, { memo } from 'react';
import { StoriesCollection } from '../api/collections/StoriesCollection';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { Loading } from './components/Loading';

export const StoriesList = () => {
  const isLoading = useSubscribe('allStories');
  const stories = useFind(() =>
    StoriesCollection.find({})
  );

  const nextStory = () => {

  }
  const previousStory = () => {

  }

  const StoryItem = ({ story }) => (
    <li className="">
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
            {story.text}
          </pre>
    </li>
  );

  if (isLoading()) {
    return <Loading />;
  }
  return (
    <div>
           <div className="px-2 py-3 ">
          <button 
            type="button"
            onClick={previousStory}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:bg-orange-900"
          >
            Previous Story
          </button>

          <button 
            type="button"
            onClick={nextStory}
            className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:bg-orange-900"
            autoFocus
          >
            Next Story
          </button>
        </div> 


      <div className="">
        <ul className="">
          {stories.map((story) => (
            <StoryItem key={story._id} story={story} />
          ))}
        </ul>
      </div>
    </div>
  );
};
