import * as path from "path";
import * as fs from "fs";

export class Config {
    public port: number;

    constructor() {
        const configFile = path.join(process.cwd(), 'config.json');
        Object.assign(this, JSON.parse(fs.readFileSync(configFile, 'utf8')));
    }
}

export const config: Config = new Config();