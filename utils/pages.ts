import { Page } from "./contentTypes";

let allPages: Page[] = [];

const fileExtension = ".json"
// make sure url ends in export?format=txt
const exampleUrl = "https://docs.google.com/document/d/1trh2t0UHJsXy_mUrwItcJd6vKuCOQXBrppWGHNwf0m8/edit";
const examplePath = "./example/";
const exampleName = "Example";
const examplePage = new Page(exampleName, examplePath+exampleName+fileExtension, exampleUrl);
allPages.push(examplePage);

export default function getPagesArray(): Page[] {
    return allPages;
}