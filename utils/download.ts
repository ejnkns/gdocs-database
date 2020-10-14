import fs = require("fs");
import { HttpClient } from "typed-rest-client/HttpClient";

export async function downloadFile(url: string, filePath: string) {
    const client = new HttpClient("clientTest");
    const response = await client.get(url);
    const file: NodeJS.WritableStream = fs.createWriteStream(filePath);

    if (response.message.statusCode !== 200) {
        const err: Error = new Error(`Unexpected HTTP response: ${response.message.statusCode}`);
        throw err;
    }

    return new Promise((resolve, reject) => {
        file.on("error", (err) => reject(err));

        const stream = response.message.pipe(file);

        stream.on("close", () => {
            try { resolve(filePath); } catch (err) {
                reject(err);
            }
        });
    });
}