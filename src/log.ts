const { ROUTE_ENV_TYPE } = process.env;

export default function log(...props: any[]) {
    if (ROUTE_ENV_TYPE !== 'dev') return;
    console.log(...props);
}
