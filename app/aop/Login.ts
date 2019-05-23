export default function Login() {
    const logFlag = false;
    if (!logFlag) {
        console.log('未登录，请先登录');
        this.ctx.redirect('/');
        return false;
    }
}
