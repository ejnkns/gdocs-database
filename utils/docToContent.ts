import { downloadFile } from "./download";
import { readFileSync, writeFile } from 'fs';
import { ContentObject, ContentTypes, Link, Para } from "./contentTypes";

// below from React-Player: https://github.com/CookPete/react-player/blob/master/src/patterns.js
const MATCH_URL_YOUTUBE = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;
const MATCH_URL_VIMEO = /vimeo\.com\/.+/;

const MATCH_URL_VIDEO = new RegExp(MATCH_URL_YOUTUBE.source + "|" + MATCH_URL_VIMEO.source);
const MATCH_URL_IMAGE = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;
const MATCH_MARKDOWN_URL = /\[(.*?)\]\((.*?)\)/g; // match[0] = "(text)[url]", match[1] = "text", match[2] = "url", match[4] = "(other text)[other_url]", etc.
const LINE_BREAK = "(line break)"
const SPLIT_NEWLINE = /[\r\n][\r\n]/;
const TEMP_FILE_NAME = "temp.txt"

// downloads a google doc as a text file, then parses the text file into a ContentObject[]
// google doc has to be formatted correctly: blank lines between content, links in markdown style
// returns the array of content objects (and writes it to the filePath if specified)
export async function docsUrlToContentObjectArray(url: string, filePath: string = TEMP_FILE_NAME): Promise<ContentObject[] | null> {
    await downloadFile(url, filePath).catch(error => console.log(error));
    // TODO: figure out a way to read file without saving it to disk?
    // should i be downloading the txt file to the final filePath and overwriting that file?
    let data = readFileSync(filePath, 'utf8');
    if (data == null || data.length == 0) {
        console.error("No data read from downloaded file...\nCheck your URL: " + url)
        return (null);
    }
    let content: ContentObject[] = [];
    let prevType: ContentTypes | null = null;
    let prevWasNullLine: boolean = true;
    for (const line of data.split(SPLIT_NEWLINE)) {
        if (line.match(MATCH_URL_IMAGE)) {
            content.push(new ContentObject(ContentTypes.Image, line.trim()));
            prevType = ContentTypes.Image;
            prevWasNullLine = false;

        } else if (line.match(MATCH_URL_VIDEO)) {
            content.push(new ContentObject(ContentTypes.Video, line.trim()));
            prevType = ContentTypes.Video;
            prevWasNullLine = false;

        } else {
            // line is Para, possibly with links and newlines within (links always wrapped in a Para)
            let paraContent: (Link | string)[] = [];
            if (line.length == 0) {
                // deal with line breaks
                if (prevWasNullLine && prevType == ContentTypes.Para) {
                    paraContent.push(LINE_BREAK);
                }
                prevWasNullLine = true;
            } else {
                prevWasNullLine = false;
                // split links (url and text) from para
                let paraText: string[] = line.trim().split(MATCH_MARKDOWN_URL);
                let i = 0;
                let linkUrl: string;
                paraText.forEach(el => {
                    if (el.length > 0) {
                        // pattern goes para -> link text -> link url
                        if (i % 3 == 0) {
                            // para
                            paraContent.push(el);
                        } else if (i % 3 == 1) {
                            // link
                            linkUrl = el;
                        } else {
                            // url
                            let link: Link = new Link(el, linkUrl);
                            paraContent.push(link);
                        }
                    }
                    i++;
                });
                if (!prevWasNullLine) {
                    // if there was content before (not a null line), need to add line break
                    paraContent.push(LINE_BREAK);
                }
            }
            if (prevType == ContentTypes.Para) {
                // replace previous para with new para with added text 
                let prevPara = content.pop()?.data;
                // have to check type for typescript to be happy
                if (prevPara instanceof Para && prevPara.content.length > 0) {
                    paraContent = prevPara.content.concat(paraContent);
                }
            }
            if (paraContent.length > 0) {
                content.push(new ContentObject(ContentTypes.Para, new Para(paraContent)));
                prevType = ContentTypes.Para;
            }
        }
    }

    // if a filePath was supplied, write it
    if (filePath !== TEMP_FILE_NAME) {
        writeFile(filePath, JSON.stringify(content), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    //TODO: delete temp.txt file if it exists
    return (content); 
}