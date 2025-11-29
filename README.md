# Klapeks's database-ui

This project I do for personal use.
It shows web interface for interactions with mysql and etc.


How I use this with express:
```ts
import { Router } from "express";
import { databaseUI, DatabaseOptions } from "@klapeks/database-ui";

const options: DatabaseOptions = { /* Some options using .env */ };
const router = Router();

router.use(async (req, res, next) => {
    // perms validation
    next();
})

router.use(databaseUI.createWebRouter());
databaseUI.createApiRouter({
    'main': options,
    ...
    'other-db': otherOptions
}).then(uiApiRouter => {
    router.use('/api', uiApiRouter);
});

// etc
```