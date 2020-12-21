import { Koa, Response } from '../../node-to-deno/koa.ts';

import { IContext } from './IContext.ts';
import { IRequest } from './IRequest.ts';

export interface ContextDelegatedResponse {
    /**
     * Get/Set response status code.
     */
    status?: number;

    /**
     * Return the response mime type void of
     * parameters such as "charset".
     *
     * Set Content-Type response header with `type` through `mime.lookup()`
     * when it does not contain a charset.
     *
     * Examples:
     *
     *     this.type = '.html';
     *     this.type = 'html';
     *     this.type = 'json';
     *     this.type = 'application/json';
     *     this.type = 'png';
     */
    type?: string;

    /**
     * Get/Set response body.
     */
    body?: any;

    /**
     * Perform a 302 redirect to `url`.
     *
     * The string "back" is special-cased
     * to provide Referrer support, when Referrer
     * is not present `alt` or "/" is used.
     *
     * Examples:
     *
     *    this.redirect('back');
     *    this.redirect('back', '/index.html');
     *    this.redirect('/login');
     *    this.redirect('http://google.com');
     */
    redirect?(url: string, alt?: string): void;
}

export interface BaseResponse {}

export interface IResponse extends Response, BaseResponse {
    ctx: IContext;
    request: IRequest;
}
