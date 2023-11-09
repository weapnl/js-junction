# Changelog

## Unreleased

## v3.3.5
- Lodash is now globally available.

## v3.3.4
- Changed how empty array/object is sent to API through form-data. Previously a key with a `null` value would be sent, now a key with an empty string value will be sent.

## v3.3.3
- Changed how empty array/object is sent to API through form-data. Previously no key or value would be sent, now a key with a `null` value will be sent.

## v3.3.2
- Added new option to `attribute, relation or accessor` called `jsonKey` which specifies the key to use when parsing from/to json. 

## v3.3.1
- Now using *signal* instead of the deprecated *cancel token* to cancel requests.
- Updated `axios` to `1.3`.
- Fixed dependency vulnerabilities (`npm audit fix`).

## v3.3.0
- Added ability to set global headers.

## v3.2.0
- Added ability to set response interceptors.

## v3.1.0
- Fixed bug where `null` values were omitted when using a FormData request.

## v3.0.5
- Fixed the bug where the given data was merged into the files object in the `storeFiles` method.

## v3.0.4
- Added build service in docker-compose.
- Booleans are now cast to `'0'` or `'1'` in form data.

## v3.0.3
- Fixed bug where `model.show()` would allow an empty parameter, effectively causing an `index` request to be executed.
- When type of `attribute, relation or accessor` is Object, and the json value is an Array, convert it to an Object.

## v3.0.2
- Improvement to some JSDoc's for better autocomplete.
- Made data of FormData recursive when using the `storeFiles` method on the `Request` model.

## v3.0.1
- Fixed bug where `false` values would be parsed as `null`.

## v3.0.0
- Added docker-compose file.
- Now using `/src/index.js` as main file instead of `/dist/index.js`.
- Added a pluck method.

## v2.7.5
- Added `toJson` and `fromJson` options for accessors.

## v2.7.4
- Fixed a bug where the default value for Accessor's was not used properly.

## v2.7.3
- Fixed a bug where query params would contain empty or null values.

## v2.7.2
- Fixed a bug in `Caster.js` where Array type would be cast to an array inside an array (for example `[["test@email.com"]]`).

## v2.7.1
- Fixed a bug in `Caster.js` where an error was thrown if an accessor value of type `Model` was null/undefined.
- Added `storeFiles()` to the `batch` class.

## v2.7.0
- Added `counts` to count relations (#3).
- Added ability to perform an action using the `action()` method in the Request class. 
- **BREAKING:** `save()` method on Model class doesn't accept `identifier` parameter anymore.

## v2.6.0
- Added ability to store files through the `storeFiles()` method in the request class.
- Added method (`customParameters`) to add custom parameters to a request.
- Now handling any status code between 200-300 as a successful request.
- Fixed a bug where the `Caster` class tried to cast an `undefined` value and crashed. Added extra check which returns `null` when the value to be cast is `undefined`

## v2.5.1
- Fixed bug where the `whereIn` filter set the wrong variable for the column.

## v2.5.0
- Added `save()` method to Model and Batch classes.
- Now setting properties on model instead of using getters/setters.
- Fixed bug where default attribute/relation values weren't set when creating a new model.
- Added ability to set type for `accessors` so they can be cast.

## v2.4.0
- Fixed bug where having 2 models with relations to each other would result in an infinite loop.
- Added `extraData` parameter to the `store()` and `update()` methods on a `Model`.
- Added function (`batch`) to run multiple requests at the same time (#2).
- Added ability to set default values in constructor of models.
- Response events are now async safe.
- Changed how casting is done and the caster doesn't try to cast `null` values anymore.
- Now formatting error messages so nested errors are returned as objects.

## v2.3.1
- Fixed bug where converting to snake case would break when using dot notation.

## v2.3.0
- **BREAKING:** Removed the `defaults()` and `casts()` methods in favor of a new `attributes()` method for better expandability of the package.
- Added `relations()` and `accessors()` methods to the Model class.
- **BREAKING:** Removed the `getAttribute()` and `setAttribute()` methods of the Model class.
- **BREAKING:** `toJson()` now returns the attributes, accessors and relations instead of just the attributes.

## v2.2.0
- Now converting columns to snake case in `order`, `search`, `whereIn` and `wheres`.
- Moved `pagination` from modifiers to separate class (in accordance with https://repo.weap.nl/packages/laravel/restapi/-/merge_requests/8).
- Added optional `findPageById` parameter to `pagination` to find the page the given id is on.

## v2.1.0
- Added `casts()` method to the `Model` class so specific casts can be done on incoming json. 
- Fixed a bug where in some filters the wrong separator was used to generate the url.

## v2.0.0
- Added `Model` class with included query builder for an easier syntax than the existing requests.
- Changed entry file from `api.js` to a new file `index.js`.
- Moved some code from `Request`  to new class `Connection` to support the new `Model` class.
- Moved `filter` and `modifier` methods to mixins.  
- **BREAKING:** Changed how the `api` is initialized and configured. Read `README.md` for more info.

## v1.1.0
- Added custom callbacks `onSuccess`, `onError`, `onValidationError`, `onUnauthorized`, `onForbidden`.

## v1.0.0
- Initial version
