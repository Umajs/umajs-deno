import { SendOptions } from '../../node-to-deno/koa.ts';

import { IContext } from '../typings/IContext.ts';
import { DOWNLOAD_PATH, VIEW_PATH, CALLBACK_FIELD } from '../utils/consts.ts';

export type TResultJsonData = {
    [key: string]: any,
}

export type TResultJsonpData = {
    [CALLBACK_FIELD]: string,
    callbackField: string,
    [key: string]: any,
}

export type TResultViewData = {
    [VIEW_PATH]: string,
    [key: string]: any,
}

export type TResultStreamData = {
    fileName?: string,
    data: any,
}

export interface TResultDownData extends SendOptions {
    [DOWNLOAD_PATH]: string
}

export type TResultRedirectData = { url: string, alt?: string };

export interface IResults {
    done: (ctx: IContext, data: any) => void;
    send: (ctx: IContext, data: any) => void;
    json: (ctx: IContext, data: TResultJsonData) => void;
    jsonp: (ctx: IContext, data: TResultJsonpData) => void;
    view: (ctx: IContext, data: TResultViewData) => void;
    stream: (ctx: IContext, data: TResultStreamData) => void;
    download: (ctx: IContext, data: TResultDownData) => void;
    redirect: (ctx: IContext, data: TResultRedirectData) => void;
}

export type TResultType = keyof IResults;

export interface IResult {
    type: TResultType | string; // 类别
    data?: any; // 数据
    status?: number; // 状态
}
