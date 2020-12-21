import { Path, RequestMethod } from '../../src/index.ts';

export const Get = (...value: string[]) => Path({
    value,
    method: RequestMethod.GET,
});

export const Post = (...value: string[]) => Path({
    value,
    method: RequestMethod.POST,
});

export const Put = (...value: string[]) => Path({
    value,
    method: RequestMethod.PUT,
});

export const Del = (...value: string[]) => Path({
    value,
    method: RequestMethod.DELETE,
});
