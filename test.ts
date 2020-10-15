import getPagesArray from "./utils/pages";
import { Page } from "./utils/contentTypes";
import { docsUrlToContentObjectArray } from "./utils/docToContent";

function run(pages: Page[]) {
    pages.forEach(page => {
        docsUrlToContentObjectArray(page.docsUrl, page.path).then(
            response => console.log('\n' + page.name + '\n' + JSON.stringify(response) + '\n'));
    });
}

run(getPagesArray());