import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { CommentsCollection } from '../api/collections/CommentsCollection';
import { StoriesCollection } from '../api/collections/StoriesCollection';
import { ProfilesCollection } from '../api/collections/ProfilesCollection';

export const AdminDump = () => {
    const [users, setUsers] = React.useState([]);
    
    Meteor.call('users.retrieve'
      , {}
      , (error, response) => {
        if(error){} 
        else {
            setUsers(response);
        }
      }
    )

    const isLoadingAllStories = useSubscribe('dumpStories');
    const isLoadingAllComments = useSubscribe('dumpComments');
    const isLoadingAllProfiles = useSubscribe('allProfiles');
    const isLoading = isLoadingAllStories || isLoadingAllComments || isLoadingAllProfiles; 
   
    var stories = StoriesCollection.find({}).fetch();
    var comments = CommentsCollection.find({}).fetch();
    var profiles = ProfilesCollection.find({}).fetch();

    Meteor.call('users.retrieve'
      , {}
      , (error, response) => {
        if(error){} 
        else {
            setUsers(response);
        }
      }
    )
         
    return (
        <a
        href={'data:text/json;charset=utf-16,'
            + encodeURIComponent(
              + 'data'
              + '\n{'
              + 'USERS:'
              + JSON.stringify(users, null, '\t')
              + ',\nPROFILES:'
              + JSON.stringify(profiles, null, '\t')
              + ',\nSTORIES:'
              + JSON.stringify(stories, null, '\t')              
              + ',\nCOMMENTS:'
              + JSON.stringify(comments, null, '\t')
              + '\n}'
              )
        }
        download={"Chrysalis " + (new Date()).toString() + ".json"}
        type="application/json"
        >
            DOWNLOAD MONGO DB DATA
        </a>
    );
}
