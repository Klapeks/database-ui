import { DatabaseOptions } from "./types";
declare const databaseUI: {
    createWebRouter(): import("express-serve-static-core").Router;
    createApiRouter(databaseInstancesOptions: {
        [name: string]: DatabaseOptions;
    }): Promise<import("express-serve-static-core").Router>;
};
export default databaseUI;
