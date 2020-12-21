import { Koa, Request } from '../../node-to-deno/koa.ts';
// import { Files } from 'formidable';

import { IContext } from './IContext.ts';
import { IResponse } from './IResponse.ts';

export interface ContextDelegatedRequest {
    /**
     * Return request header, alias as request.header
     */
    headers?: any;

    /**
     * Get/Set request URL.
     */
    url?: URL;

    /**
     * Get origin of URL.
     */
    origin?: string;

    /**
     * Get/Set request method.
     */
    method?: string;
}

export interface BaseRequest {}

export interface IRequest extends Request, BaseRequest {
    ctx: IContext,
    response: IResponse
    // body?: any;
    // files?: Files;
}
