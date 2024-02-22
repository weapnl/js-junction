import { AxiosResponse } from 'axios';

interface JsonMap {
    [key: string]: any;
}

// Definieer de class en zijn methoden
declare class Api {
    constructor();

    host(host: string): this;
    suffix(suffix: string): this;
    readonly baseUrl: string;

    request(uri: string): Request;
    cancelRequests(): this;
    batch(requests: Request[]): Batch;

    setBearer(token: string): void;
    resetBearer(): void;
    setCsrf(token: string): void;
    resetCsrf(): void;

    setHeader(key: string, value: string): void;
    removeHeader(key: string): void;

    onSuccess(callback?: (data: any) => void): this;
    onError(callback?: (response: AxiosResponse) => void): this;
    onValidationError(callback?: (validation: any) => void): this;
    onUnauthorized(callback?: (response: AxiosResponse) => void): this;
    onForbidden(callback?: (response: AxiosResponse) => void): this;

    responseInterceptors(
        onSuccess?: (response: AxiosResponse) => void,
        onError?: (error: any) => void
    ): this;
}

interface Response {
    data: any;
    statusCode: number;
    validation?: {
        message: string;
        errors: object;
    };
}

declare class Mixins {
    count(relations: any[]): this;
    limit(amount: number): this;
    order(input: string | any[], direction?: string): this;
    with(relations: any[]): this;
    scope(name: string, ...params: any[]): this;
    scopes(...params: any[]): this;
    search(value: any, columns?: any[]): this;
    where(column: string, operator: string, value?: any): this;
    wheres(...params: any[]): this;
    whereIn(column: string, values: any[]): this;
    whereIns(...params: any[]): this;
    whereNotIn(column: string, values: any[]): this;
    whereNotIns(...params: any[]): this;
    pluck(fields: any[]): this;

    appends(appends: string | string[]): this;
    hiddenFields(hiddenFields: string | string[]): this;

    action(name: string, id?: number): this;

    pagination(page: number, perPage?: number, findPageForId?: number | null): this;
}

declare class Request extends Mixins {
    constructor();
    readonly response: Response;
    setUrl(url: string): this;
    cancel(): this;
    get(): Promise<this>;
    post(data?: object): Promise<this>;
    put(data?: object): Promise<this>;
    setKey(name: string): this;
    delete(): Promise<this>;
    storeFiles(files?: object, data?: object): Promise<this>;
    readonly bodyParameters: object;
    onSuccess<T = any>(callback?: (result: T, data: any) => void): this;
    onError(callback?: (response: Response) => void): this;
    onValidationError(callback?: (validation: object) => void): this;
    onUnauthorized(callback?: (response: Response) => void): this;
    onForbidden(callback?: (response: Response) => void): this;
    triggerResponseEvents(response: Response, successResponse?: any): Promise<void>;
    customParameters(parameters?: object): this;
    setApi(api: Api): this;
}

export class Model extends Request {
    constructor(defaults?: JsonMap);

    static fromJson(json: JsonMap): Model;

    toJson(): JsonMap;

    fill(values?: JsonMap): this;

    static accessors(): JsonMap;

    static attributes(): JsonMap;

    static counts(): JsonMap;

    static relations(): JsonMap;

    static readonly endpoint: string;

    readonly _identifier: number | string;

    index(): Promise<Model[]>;

    show(identifier?: number | string): Promise<Model | null>;

    store(extraData?: JsonMap): Promise<Model>;

    update(extraData?: JsonMap): Promise<Model>;

    destroy(): Promise<boolean>;

    save(extraData?: JsonMap): Promise<Model>;

    clone(): Model;

    _queryString(identifier?: number | string): string;
}

declare class Batch {
    constructor(requests: any[]);

    readonly successful: boolean;
    readonly successfulRequests: any[];
    readonly failedRequests: any[];

    get(): Promise<any[]>;
    post(): Promise<any[]>;
    put(): Promise<any[]>;
    delete(): Promise<any[]>;
    index(): Promise<any[]>;
    show(): Promise<any[]>;
    store(): Promise<any[]>;
    update(): Promise<any[]>;
    destroy(): Promise<any[]>;
    save(): Promise<any[]>;
    storeFiles(): Promise<any[]>;

    execute(method: string): Promise<any[]>;
}

declare const api: Api;
export default api;
