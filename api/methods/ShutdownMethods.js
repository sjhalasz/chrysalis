import { Meteor } from 'meteor/meteor';
import { Shutdown } from './Shutdown';

Meteor.methods({
    'shutdown'(){
        return Shutdown();
    }
}

)