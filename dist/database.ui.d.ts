import { DatabaseOptions } from "./types";
declare const databaseUI: {
    createWebRouter(): void;
    createRouter(options: DatabaseOptions): Promise<import("express-serve-static-core").Router>;
};
export default databaseUI;
