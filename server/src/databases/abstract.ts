import { DatabaseOptions, DatabaseType } from "../types";
import utils from "../utils/utils";



export default abstract class AbstractDatabase {

    readonly options: DatabaseOptions;
    readonly key: string;
    constructor(options: DatabaseOptions) {
        this.options = options;
        this.key = utils.randomPassword(64);
    }

    public abstract sql(query: string, params: any[]): Promise<any>;
}