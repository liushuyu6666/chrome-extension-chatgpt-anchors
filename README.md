# Project Structure
There are many ways to structure an extension project; however, the only prerequisite is to place the `manifest.json` file in the extension's root directory.

## manifest.json
The manifest JSON file is the only required file.
- It must be located at the root of the project.
- The only required keys are `manifest_version`, `name`, and `version`.
- It supports comments (`//`) during development, but these must be removed before uploading your code to the Chrome Web Store.

# Keys in `manifest.json`

The `manifest.json` file defines the basic information of the extension and specifies how the extension reacts at specific moments or to specific events by using reserved keys.

There are several reserved keys in the `manifest.json` file, each serving a specific purpose. For example, the "background" key is used to define background scripts or service workers. However, the filename of your background script can be anything you choose; it doesn't have to be named `background.js`.

- Basic Information:

  - Name, Version, Description: Identifies the extension to users.
  - Icons: Specifies the icons used in the browser UI.
  - Default Locale: Sets the default language for localization.

- Reserved Keys for Behavior Configuration:

  - `background`: Defines background scripts or service workers that run independently of any web page.
  - `content_scripts`: Specifies scripts that run in the context of web pages.
  - `permissions`: Declares the permissions the extension needs to function.
  - `browser_action` / action: Configures the extension's toolbar button and popup.
  - `commands`: Defines keyboard shortcuts and commands.
  - `web_accessible_resources`: Lists resources that can be accessed by web pages.

## content scripts

Content scripts can read the content of a page and add event listeners. They can also inject scripts into the page without conflicting with the host page or other extensions' content scripts, as they operate in isolated environments.

Content scripts need to be registered in the `manifest.json` before they can be used.

## background

In a Chrome extension, background specifies a script (usually called `background.js`) that runs in the background of the browser, separate from any specific web page. It serves as the central controller for your extension's background functionality. Key roles include:

- Event Handling: Listens for and responds to browser events like tab updates or user interactions.
- Persistent State: Manages data and state that need to persist across different pages or browser sessions.
- Communication Hub: Facilitates communication between various parts of the extension (e.g., content scripts, popup).
- Access to Chrome APIs: Utilizes privileged Chrome APIs to perform actions not available to content scripts.

## action
The action key in the `manifest.json` file is responsible for defining the behavior of your extension's toolbar button, including rendering the popup when it's clicked. However, the action key itself does not directly specify JavaScript files to execute other work beyond the popup. Instead, additional functionality can be implemented through the popup's script or by handling events in the background script.


# Deployment
## Test
To test the extension, we can load it as an unpacked extension. If it is a JavaScript project, we can upload it directly. However, if it is a TypeScript project, we need to build it first before loading its `dist` folder.