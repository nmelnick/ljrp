import * as fs from "fs";
import * as path from 'path';
import { Validator } from "express-json-validator-middleware";

const validator = new Validator({});
const schemaPath = path.resolve(path.join(__dirname, "..", "doc"));

export const schemas = {
    authRequest: JSON.parse(fs.readFileSync(path.join(schemaPath, "AuthRequest.schema.json")).toString()),
    friendsCheckRequest: JSON.parse(fs.readFileSync(path.join(schemaPath, "FriendsCheckRequest.schema.json")).toString())
};

export const validators = {
    authRequest: () => validator.validate({ body: schemas.authRequest }),
    friendsCheckRequest: () => validator.validate({ body: schemas.friendsCheckRequest })
};

