# pre-beta-alpha version 0.0.0.0.1 do not expect this to work or make any sense
# gdocs-database
Use Google Docs to host your website's (or app's) content.
See [this short code](https://repl.it/@ElliotJenkins/SilverSingleAdware) for an interactive example in Nodejs.
See [this repo](https://github.com/ejnkns/cskeiso-react) for an example in Reactjs and Typescript.

## Why?
Have you ever had someone you're making a website for ask you to change one word in a paragraph? Add one image to a page? These simple yet very specific tasks are what clients often most care about, and what developers least care about.

I wanted to have a way for non-developers to change and add content to their website in a way they are already familiar with. With `gdocs-database`, Google Docs can be used to host the parts of the website that clients should have control over, taking away unnecessary responsibility from the developer.

## How?
Google Docs are exported as txt files which are then parsed into custom objects that you can use to build your view. 

## Installation
```bash
npm install gdocs-database
```
## Getting Started
The basic steps are these:
- Format a Google Doc
- Get the public URL for the doc
- Pass the public URL and a path to `docToContent(docsUrl, filePath)`
- Read the resulting JSON file with `getContent(jsonFile)`
- Write your own function to parse the resulting `ContentObject` array into divs for your website (see [here](https://github.com/ejnkns/cskeiso-react/blob/master/client/src/common/OneColumn.tsx) for an example).

### Google Doc Formatting
There are different types of content that can be added to the Google Doc to be displayed on your website.
- Different types of content should be seperated by a line break. 
- Inline links should be formatted in Markdown style:
`[Click here!](https://<whataver-url-you-want>)`
- Media like images and videos can all just be added by putting the URL/URI on it's own line in the doc.

See this [Example Google Doc](https://docs.google.com/document/d/1KXAmis1n1FzduV6sNkzHhmWdInSfSBjIsH2wQXU0dn4/edit), and the [corresponding webpage](https://cskeiso.herokuapp.com/work/5-Ways).

### Get the public Google Doc export URL
A Google Doc represents a section of content to be displayed.
To get a public Google Doc URL: 
- While editing a Google Doc, click 'Share' in the top right
- Under 'Get Link' click 'Copy link'
- Make sure 'Anyone with the link' is set to 'Viewer', as this URL will be public

## Module Exports
### Classes and Types
##### Class `Page`
Used to help store information about a page of content.
Properties:
- `name?: string` an optional name for the page
- `path: string` a path the JSON file will be written to
- `docsUrl: string` the public google docs URL

##### Class `Link`
Used to represent the text and URL of a link.
Properties:
- `text: string` the text to click on
- `url: string` the public google docs URL

##### Class `ContentObject`
Stores the data associate with content from the Google Doc.
Properties:
- `contentType: ContentTypes` denotes a 'type' for the content data
- `data: string | Link | Para` the data

##### Enum `ContentTypes`
Defines the types of content possible
##### Type `jsonType`
The type declaration for the resulting JSON file.
Useful if you want to write your own function to parse the JSON to something other than a ContentObject array.
### Functions
##### `docToContent`
``` typescript
async function docToContent(url: string, filePath: string = TEMP_FILE_NAME): Promise<ContentObject[] | null>
```
Downloads a Google Doc as a text file, then parses the text file into a `ContentObject` array.
Returns a promise of an array of `ContentObject`s and writes it as JSON to the file path if specified.
##### `getContent`
``` typescript 
function getContent(json: jsonType): ContentObject[]
```
Parses the JSON file (resulting from a call to `docToContent`) to a `ContentObject` array. You can then write your own function to iterate through the `ContentObject`s and build your view.
