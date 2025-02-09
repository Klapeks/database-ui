import { DatabaseOptions } from "@/types";
export default abstract class AbstractDatabase {
    readonly options: DatabaseOptions;
    constructor(options: DatabaseOptions);
    abstract sql(query: string, params: any[]): Promise<any>;
}
