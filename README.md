# JS-Junction

This project allows you to easily consume API's built with [Laravel-Junction](https://github.com/weapnl/Laravel-Junction).

This package has support for Typescript (TS).

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
    - [Creating Models](#creating-models)
    - [Performing Requests](#performing-requests)
    - [Applying Filters and Scopes](#applying-filters-and-scopes)
    - [Uploading Files with Spatie Medialibrary](#uploading-files-with-spatie-medialibrary)

## Installation
```bash
npm install @weapnl/js-junction
```

## Quick Start
```javascript
import api, { Model } from '@weapnl/js-junction';

api.host('YOUR API HOST URI HERE') // Optionally: add '.suffix('API SUFFIX HERE');'

// Define a model
class User extends Model {
    static attributes () {
        return {
            id: {
                type: Number,
            },
            name: {
                type: String,
            },
        };
    }

    static get endpoint () {
        return 'users';
    }
}

// Create a new user.
const user = new User();
user.name = 'John';
user.store(); // Or .save()

// Retrieve a user.
const user = await new User().show(1);

// Update the user.
user.name = 'Jane';
user.update(); // Or .save()

// Delete the user.
user.destroy();

// List all users.
const users = await new User().index();
```

## Usage

### Creating Models
```javascript
// User.js
import { Model } from '@weapnl/js-junction';

export default class User extends Model {
    // All the model properties which are fully readable and fillable on the API
    static attributes () {
        return {
            // Note: id is ALWAYS required
            id: {
                // Default value to be assigned when creating the empty property.
                default: 0,

                // Will be used to cast from/to json. Has higher priority than the seperate 'fromJson' and 'toJson' methods.
                type: Number, // Type will be used to cast from and to json

                // Casts that will be performed when creating the model from json.
                // Allows:
                // - Functions
                // - Array of functions, executed from left to right and each following function gets the return value of the previous.
                // - Javascript types
                // - Models that inherit from the Model class.
                fromJson: _.toNumber,
                toJson: [_.toString, _.trim],

                // The key which is used when parsing the attribute from/to json. By default the snake_case version of the attribute name will be used.
                jsonKey: 'id',
            }, 

            // All options are optional and if no options are given an empty object should be passed.
            name: {},
            email: {},
            phone: {},
        };
    }

    // Relations of the model which are defined in the API
    static relations () {
        return {
            addresses: {
                // Value(s) of the relation will be cast to the type. Same casts are allowed as the attributes. 
                // If a list of items is returned, the cast will be preformed on each item seperately.
                type: Address,

                // The key which is used when parsing the attribute from/to json. By default the snake_case version of the attribute name will be used.
                jsonKey: 'id',
            },
        };
    }

    // Accessors of the model which are defined in the API.
    static accessors () {
        return {
            fullName: {
                // Default value to be assigned when creating the empty property.
                default: '',

                // Will be used to cast from/to json. Has higher priority than the seperate 'fromJson' and 'toJson' methods.
                type: String,

                // Casts that will be performed when creating the model from json.
                // Allows:
                // - Functions
                // - Array of functions, executed from left to right and each following function gets the return value of the previous.
                // - Javascript types
                // - Models that inherit from the Model class.
                fromJson: _.toNumber,
                toJson: [_.toString, _.trim],

                // The key which is used when parsing the attribute from/to json. By default the snake_case version of the attribute name will be used.
                jsonKey: 'id',
            },
        }
    }

    // Counts of relations of the model which are defined in the API.
    static counts () {
        return {
            posts: {
                default: 0,
            },
        }
    }

    // Used to know what URL to send the request to.
    static get endpoint () {
        return 'users';
    }
}
```

### Performing Requests

#### Model Requests
```javascript
// Create a new user.
const user = new User();
user.name = 'John';
user.store();

// Retrieve a user.
const user = await new User().show(1);

// Update the user.
user.name = 'Jane';
user.save(); // This will call store() or update() depending on the id of the model.

// Delete the user.
user.destroy();

// List all users.
const users = await new User().index();
```

#### Applying filters and scopes
```javascript
// Get all users that match the filters
const request = await new User()
    .limit(10) // Limit max 10 items
    .order('id', 'asc') // Order by id ascending
    .order([['id', 'asc'], ['name', 'desc']]) // Order by id ascending and name descending
    .with('orders') // Load relation
    .with(['orders']) // Load relations
    .count('orders') // Add relation counts (will add a key `ordersCount` to the result)
    .scope('hasOrders', 'extra params') // Apply scope
    .search('john doe') // Search for 'john doe', on the searchable columns of the model (defined in the API)
    .search('john doe', ['name', 'email']) // Search for 'john doe' in columns 'name' and 'email'
    .whereIn('city', ['Gemert', 'Eindhoven', 'Amsterdam']) // Set where in clause
    .whereNotIn('city', ['Rotterdam', 'London']) // Set where not in clause
    .where('name', '=', 'John') // Add where clause
    .where('name', 'John') // If no operator is given, '=' is used
    .appends('age') // Add accessor
    .appends(['age']) // Add accessors
    .hiddenFields('id') // Hide field
    .hiddenFields(['id', 'comments']) // Hide fields
    .pluck('name') // Only retrieve the given fields
    .pluck(['name', 'company.name']) // Only retrieve the given fields 
    .pagination(1, 25) // Paginate 25 per page, page 1
    .pagination(1, 25, 50) // The 3th parameter is a pageForId parameter. This is used to find the correct page for the given id. If the id can not be found, the given page will be used. It will now look for the user with id 50, and returns that page.
    .simplePagination(1, 25) // You can use this to simply navigate through pages (without receiving the total pages). This can be helpful for large database tables. The first parameter is the page number and the second parameter is the `items per page` amount.
    .get();
```

#### Examples

**The `.save()` method.**

To create a new record or update an existing one, you can use the `.save()` method. This method is a convenient shortcut for `.store()` and `.update()`. It determines whether to create or update by checking if the model's `id` is set. If an `id` is present, `.update()` is called; otherwise, `.store()` is used to create a new record.

**Cloning a model's instance.**
```javascript
// Return a clone of the model
const user = await new User().show(1);
const clonedUser = user.clone();
```

**Batch requests**
```javascript
const firstUser = await new User().show(1);
firstUser.name = 'John';

const secondUser = await new User().show(2);
secondUser.name = 'Jane';

const batch = await api.batch([
    firstUser,
    secondUser,
]);

await batch.update();

if (batch.successful) {
    // All requests executed successfully.
}
```

**Regular requests**
```javascript
// Get all users from a custom endpoint
const users = api.request('users').get();

// Custom POST request
await api.request('users')
    .onSuccess((data, response) => {
        // Handle success
    })
    .post({
        name: 'John',
        email: 'john@example.com'
    });
```
The request has support for GET, POST, PUT and DELETE requests.

**Custom actions**

This package also supports custom actions. These actions can be defined in the API and can be called on a model or a custom request.
```javascript
const request = await api
    .request('CUSTOM ENDPOINT')
    .action('actionName', 1) // You can pass the id of the model here, or the id of the request. In this case it is 1.
    .put({
        // Extra data
    });

const user = await new User().show(1);

const request = await user
    .action('actionName') // It will take the id of the user now, since it is a model. The id is 1 in this case.
    .put({
        // Extra data
    });
```
**Store files**

```javascript
// First parameter is a file or array of files.
// Second parameter is an object with possible extra data to send to the backend. PLEASE NOTE: Be aware that it will be sent as FormData.

let request = await api.request('users/files')
    .storeFiles(this.files, {
        filePrefix: 'test_', 
        extraDataId: 123,
    });
```

**Response events**
- You can set global response events which will be called for every request by adding the event callback on the Api class.
- You can set response events directly on requests so they will only be called for that specific request. After executing the request, they will be automatically reset.
```javascript
let request = await api.request('users')
    .onSuccess((data, response) => {
        // Request successful.
    })
    .onUnauthorized((response) => {
        // Missing or invalid token.
    })
    .onForbidden((response) => {
        // Access not allowed.
    })
    .onValidationError((validation, response) => {
        // validation.message
        // validation.errors
    })
    .onError((response) => {
        // Any other status code not caught by other callbacks.
    })
    .onFinished((response) => {
        // After the request was finished (a request is finished if it returned a response).
    })
    .onCancelled((response) => {
        // When a request is cancelled.
    })
    .get();
```

It's possible to clear the currently set callbacks on a request.

```javascript
request
    .clearOnSuccessCallbacks()
    .clearOnUnauthorizedCallbacks()
    .clearOnForbiddenCallbacks()
    .clearOnValidationErrorCallbacks()
    .clearOnErrorCallbacks()
    .clearOnFinishedCallbacks()
    .clearOnCancelledCallbacks();
```

**Cancel requests**

If you want to cancel a pending request, you can do the following:
```javascript
const request = api.request('users').get();
request.cancel();

api.cancelRequests(); // Cancel all currently pending requests.
```

You are also able to cancel requests by a key. This is useful when you want to allow only one request at a time for a specific action (a table index for example). This works on all types of requests.

To do this, you can use the following:

```javascript
const request = api
        .request('users')
        .setKey('get-users')
        .get();
```
A previously pending request with the same key will be cancelled, and this new request will be executed.

This is also possible on a model:
```javascript
const user = await new User()
        .setKey('get-user')
        .index();
```

**Set a bearer token**

```javascript
api.setBearer('YOUR TOKEN HERE');

api.resetBearer(); // Resets the bearer token.
```

**Set a CSRF token**

```javascript
api.setCsrf('YOUR TOKEN HERE');

api.resetCsrf(); // Resets the CSRF token.
```

**Set a custom header**

```javascript
api.setHeader('HEADER NAME HERE', 'YOUR VALUE HERE');

api.removeHeader('HEADER NAME HERE'); // Removes the header.
```

**Sample response**

After executing a request, the property `response` contains a `Response` object, which has properties `statusCode`, `data` and `validation`.

### Uploading Files with [Spatie Medialibrary](https://spatie.be/docs/laravel-medialibrary/v11/introduction)

#### Step 1: Uploading Files to a Model
To upload files to a model, use the `upload` function available on the model instance. This function requires two arguments:

1. **Uploaded Files**: An array of files, typically obtained from an input field of `type="file"`.
2. **Collection Name**: The name of the media [collection](https://spatie.be/docs/laravel-medialibrary/v11/working-with-media-collections/simple-media-collections) to which the files should be attached. This corresponds to the collection defined in your Laravel model.

**Example Usage:**
```js
// Retrieve the employee model instance (e.g., Employee with ID 3)
const employee = Employee.show(3);

// Upload the files to the 'IdentityFiles' collection
employee.upload(uploadedFiles, 'IdentityFiles');
```

In this example, `uploadedFiles` is an array of files from an input field, and `'IdentityFiles'` is the name of the media collection on the `Employee` model where these files should be stored.

#### Step 2: Handling the Uploaded Files
Once the `upload` function is called, the files are sent to the API. The API temporarily stores these files in the media library and returns the media IDs associated with each file. These media IDs are automatically set on the model instance.

#### Step 3: Saving the Model with Attached Media
After uploading the files, you can call the `.save()` method on the model instance. This step finalizes the process by permanently attaching the uploaded files to the specified media collection on the model. The media IDs stored on the model are now linked to the correct collection in the database.

**Example of Saving the Model:**
```js
// Save the employee model with the uploaded files attached
employee.save();
```

When the `save()` method is invoked, the model is updated or created (depending on whether it was previously persisted), and the uploaded media files are attached to the correct collection as defined in the earlier steps.

#### Advanced Usage: Uploading Files in Nested Structures
If your model contains nested relationships, such as an `Employee` model with a `Contact` relationship, you can still use the `upload` function to attach files to the appropriate collection within the nested structure.

**Example with Nested Structure:**
```js
// Retrieve the employee model instance
const employee = Employee.show(3);

// Upload a profile picture to the 'ProfilePicture' collection within the 'Contact' relationship
employee.contact.upload(uploadedFiles, 'ProfilePicture');

// Save the employee model, including the nested contact with the attached profile picture
employee.save();
```

In this scenario, the uploaded files are linked to the `ProfilePicture` collection within the `Contact` relationship of the `Employee` model. When the `save()` method is called, the files are properly attached within the nested structure.
