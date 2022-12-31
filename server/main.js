import '../api/collections/ContactsCollection';
import '../api/collections/TransactionsCollection';
import '../api/methods/ContactsMethods';
import '../api/methods/TransactionsMethods';
import '../api/methods/RolesMethods';
import '../api/publications/ContactsPublications';
import '../api/publications/WalletsPublications';
import '../infra/CustomError';
import '../infra/accounts';
import '../infra/roles';

process.env.METEOR_SETTINGS = 
{
    "packages": {
      "quave:email-postmark": {
        "from": "noreply@gmail.com",
        "apiToken": "fedd0c18-5c64-46c2-91f7-6070858e7249"
      }
    }
  };
