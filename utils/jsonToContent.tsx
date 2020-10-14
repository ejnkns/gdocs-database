import { ContentObject, Link, Para, ContentTypes} from "./contentTypes";
import { jsonType } from "./contentTypes";

export function getContent(json: jsonType): ContentObject[] {
    let len = json.length;
    let c: ContentObject[] = [];
    for (let i = 0; i < len; i++) {
        let e = json[i];
        if (e.contentType !== ContentTypes.Para) {
            // no nesting
            c[i] = new ContentObject(e.contentType, e.data);
        } else if (e.data instanceof Object) {
            // have to check instanceof or typescript doesn't like it
            // nesting
            let paraContent: (string | Link)[] = [];
            e.data.content.forEach((el: string | Link) => {
                if (typeof (el) == "string") {
                    paraContent.push(el);
                } else {
                    paraContent.push(new Link(el.url, el.text));
                }
                c[i] = new ContentObject(e.contentType, new Para(paraContent));
            });
        }
    }
    return (c);
}