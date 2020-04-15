import { compileFromFile } from 'json-schema-to-typescript'
import * as fs from 'fs';
import * as path from 'path';

const schemaPath = path.resolve(path.join(__dirname, "..", "..", "doc"));
const dtoPath = path.resolve(path.join(__dirname, "..", "..", "src", "dto"));
console.log("Reading from " + schemaPath);
console.log("Writing to " + dtoPath);

fs.readdir(schemaPath, (err, files) => {
    files.forEach((file) => {
        if (file.endsWith("schema.json")) {
            const baseName = file.replace(".schema.json", "");
            compileFromFile(path.join(schemaPath, file))
              .then(ts => fs.writeFileSync(path.join(dtoPath, baseName + ".ts"), ts))
        }
    });
});
 