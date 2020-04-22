import { createHash } from "crypto";
import * as fs from "fs";
import * as path from "path";

export class Config {
    public port: number;

    public base: string;

    constructor() {
        const configFile = path.join(process.cwd(), 'config.json');
        Object.assign(this, JSON.parse(fs.readFileSync(configFile, 'utf8')));
        this.base = createHash('md5').update(process.cwd() + configFile).digest("hex");
    }
}

export const config: Config = new Config();
