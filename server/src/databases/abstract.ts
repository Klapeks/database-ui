import { DatabaseOptions, DatabaseType } from "@/types";



export default abstract class AbstractDatabase {

    readonly options: DatabaseOptions;
    constructor(options: DatabaseOptions) {
        this.options = options;
    }

    public abstract sql(query: string, params: any[]): Promise<any>;
}