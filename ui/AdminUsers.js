import { Meteor } from 'meteor/meteor';
import React from 'react';

export const AdminUsers = () => {
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
    return (
        <>
            <br/>Users
            <ol>
              {users.map((usr) => (
                <li key={usr._id}>User Name: {usr.username} / Email: {usr.email}</li>
              ))}
            </ol>
        </>
    );
}
