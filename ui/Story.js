import React from 'react';
import { Meteor } from 'meteor/meteor';
import { ErrorAlert } from './components/ErrorAlert';
import { SuccessAlert } from './components/SuccessAlert';

export const Story = () => {
    const [title, setTitle] = React.useState(''); 
    const [text, setText] = React.useState('');
    const [year, setYear] = React.useState("");
    const [published, setPublished] = React.useState();
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    
    const showError = ({ message }) => {
      setError(message);
      setTimeout(() => {
        setError('');
      }, 5000);
      console.log(message);
    };

      const showSuccess = ({ message }) => {
        setSuccess(message);
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      };
     
    const saveStory = () => {
      Meteor.call(
        'story.insert',
        { title, text, year, published},
        (errorResponse) => {
          errorResponse ?
          showError({ message: errorResponse.error}) :
          showSuccess({ message:"Story saved."});
        }
    );
  }
  
    return (
      <div className="flex flex-col items-center">
       <h3 className=" text-lg text-base font-medium">
        Story
      </h3>
      {error ? <ErrorAlert message={error} /> : <SuccessAlert message={success} />}
      <form className="mt-6">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 sm:col-span-6 lg:col-span-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>
  
          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700"
            >
              Year
            </label>
            <input
              type="text"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <label
              htmlFor="text"
              className="block text-sm font-medium text-gray-700"
            >
              Text
            </label>
            <input
              type="text"
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>
    
        </div>
        <div className="px-2 py-3 text-right">
          <button
            type="button"
            onClick={saveStory}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:bg-orange-900"
          >
            Save Story
          </button>
        </div>
      </form>
</div>
    );
    }

