import { Around } from "../../src";

console.log('test');

@Around((point) => {
    const { proceed, args } = point;
    return proceed(args);
})
export default class Test {
    // test(){}
}
