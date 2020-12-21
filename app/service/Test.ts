import { Resource } from '../../src/index.ts';

@Resource()
export default class Test {
    test() {
        return 1;
    }
}