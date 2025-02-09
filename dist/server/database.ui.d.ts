import { DatabaseOptions } from "./types";
declare const databaseUI: {
    createWebRouter(): import("express-serve-static-core").Router;
    createRouter(options: DatabaseOptions): Promise<import("express-serve-static-core").Router>;
};
export default databaseUI;
