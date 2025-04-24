# Changelog

## Unreleased

## v0.1.4
- Added response in `onSuccess` and `onValidationError` callbacks.

## v0.1.3
- Added functionality to add the same global callback on an api multiple times.
- Callbacks (response events) are now cleared from the Request after a request has been made and the response events have been called once.

## v0.1.2
- Fixed a bug where not all subsequent requests would be cancelled.

## v0.1.1
- Added functionality to add the same callback on a request multiple times.
  - ⚠️ With the old functionality setting a callback on a request would overwrite the globally defined callback. This is no longer the case, as both the global and request callbacks will be executed.
- Improved how axios responses are handled.
  - ⚠️ Deprecated `failed` getter on the `Response` class in favor of a new `isFailed` getter. 
- Added `onCancelled` method on `Api` and `Response` classes.
- Updated the `docker-compose.yml` file to use the `node:22` image.

## v0.1.0
- Added the Temporary Media Upload functionality.

## v0.0.11
- Fixed a bug where cancelled requests would cause issues when cancelling subsequent requests.

## v0.0.10
- Updated Readme.md
- Added onFinished to the index.d.ts file (TS support).
- Remove request from _requests array after the request was finished.
- Added support for simple pagination.

## v0.0.9
- Added option to override the config of an request.
- Added the body parameters to the post request.
- Updated the requests variable from a object to an array.

## v0.0.8
- Model post requests.
- Added onFinished callback.

## v0.0.7
- Request cancel improvements.

## v0.0.6
- Added support for request cancellation by key.

## v0.0.5
- Added license file.
- Private field bugfix, proxy access.

## v0.0.4
- Added support for whereNotIn.
- Reactive bugfix, private property.

## v0.0.3
- Added ability to override the api instance on requests.
- Scopes & Wheres improvements.

## v0.0.1
- Initial version.
