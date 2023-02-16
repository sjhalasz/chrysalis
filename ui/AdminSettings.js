import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { Loading } from './components/Loading';
import { ErrorAlert } from './components/ErrorAlert';
import { SuccessAlert } from './components/SuccessAlert';
import { SettingsCollection } from '../api/collections/SettingsCollection';

export const AdminSettings = () => {
  const [oldSettings, setOldSettings] = React.useState("{}");
  const [newSettings, setNewSettings] = React.useState("{}");
  const isLoading = useSubscribe('settings');
  const settingsCursor = useFind(() => SettingsCollection.find({}));
  {/* These are used to display messages to the user.  */}
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [gotSettings, setGotSettings] = React.useState(false);

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
  
  const saveSettings = () => {
    {/* Clear any extant messages.  */}
    setError('');
    setSuccess('');
    Meteor.call(
      'settings.save',
      { settings:oldSettings },
      (error, response) => {
        if(error){
          showError({ message: error.reason}) 
        } else {
          showSuccess({ message:"Settings saved."});
        }
      }
    );
  }

  if(isLoading()){
    return <Loading />;
  } else {

    if(!gotSettings){
        settingsCursor.map((doc) => {
          setOldSettings(doc.settings.settings);
        });
        setGotSettings(true);
      }
      
    return (
      <>
        Settings

        <div className='h-20'>
          {/* Display an error message or success message or help message.  */}
          {error ? 
            <ErrorAlert message = {error} /> 
            : <SuccessAlert message={success} 
            />
          }
        </div>
        <form
          onSubmit={saveSettings}
        >
          <textarea
            id="settings"
            value={oldSettings}
            onChange={(e) => setOldSettings(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            wrap="soft"
            rows="8"
          >
          </textarea>
          <br/>
          <button
            type="submit"
          >
            Save Settings
          </button>
        </form>
      </>
    );
  }
}