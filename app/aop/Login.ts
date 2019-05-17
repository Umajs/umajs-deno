export default function Login() {
    console.log('未登录，请先登录');
    this.ctx.redirect('/');
    return false;
}
