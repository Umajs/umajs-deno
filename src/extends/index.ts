import * as Koa from 'koa';

import { mixin } from '../utils';

export default function expansion(app: Koa, { context, request, response }: {
    context: { [key: string]: any },
    request: { [key: string]: any },
    response: { [key: string]: any },
}) {
    mixin(false, app.context, context);
    mixin(false, app.response, request);
    mixin(false, app.request, response);
}
