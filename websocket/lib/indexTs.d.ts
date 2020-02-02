interface IOption {
    wsUrl: string;
    [pronName: string]: any;
}
interface IResponseCallbacksItem {
    resolve: Function;
    reject: Function;
}
interface IResponseCallbacks {
    [pronName: string]: IResponseCallbacksItem;
}
interface IParam {
    [pronName: string]: any;
}
interface IStashCallbacksItem {
    uri: string;
    reqid: string;
    param?: IParam;
}
interface IResponseData {
    ret: number;
    msgtype: string;
    data: IParam;
    errmsg: string;
    reqid: number;
    [pronName: string]: any;
}
interface IPushData {
    event: string;
    eventid: number;
    createtime: number;
    [pronName: string]: any;
}
interface IPushFunction {
    (data: IPushData): void;
}
declare class MyWebsocket {
    private ws;
    wsUrl: string;
    private requestId;
    responseCallbacks: IResponseCallbacks;
    stashCallbacks: Array<IStashCallbacksItem>;
    private heartbeatCheckIntervalTimer;
    private heartbeatIdleTimer;
    private heartbeatCheckIntervalTimes;
    private heartbeatIdleTimes;
    private evnetCb;
    constructor(option: IOption);
    /**
     * 连接websocket
     */
    conection(): void;
    /**
     * 关闭websocket连接
     */
    close(): void;
    send(uri: string, param?: IParam): Promise<IResponseData>;
    /**
     * 0: 正在链接中,WebSocket.CONNECTING
     * 1: 已经链接并且可以通讯,WebSocket.OPEN
     * 2: 连接正在关闭,WebSocket.CLOSING
     * 3: 连接已关闭或者没有链接成功,WebSocket.CLOSED
     * 4: 还没有建立ws连接
     */
    getReadyState(): number;
    go(): void;
    getResponseCallbacks(): IResponseCallbacks;
    getStashCallbacks(): IStashCallbacksItem[];
    private sendHandler;
    private requestHandler;
    private pushHandler;
    private stashCallbacksHandler;
    private checkHeardBeat;
    private reconection;
    on(eventName: string, cb: IPushFunction): void;
    emit(eventName: string, data?: any): void;
}
export default MyWebsocket;
