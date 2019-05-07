export default function Before() {
    console.log('-------before interceptor', this.req.path);
    // return false;
}
