import * as express_serve_static_core from 'express-serve-static-core';

declare function createRemindrApp<T>(options: {
    clientPath: string;
    matchKey?: string;
    mapItemToRow: (item: {
        id: string;
        label: string;
        checked: boolean;
    }) => Partial<T>;
}): express_serve_static_core.Express;

export { createRemindrApp };
