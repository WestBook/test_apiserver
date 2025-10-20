export type Cmds = {
    key: string;
    index: number;
    delayTime: number;
    interval?: number;
};

type CommandData = {
    title: string;
    data: any;
};

type CommanObject = {
    [key: string]: CommandData[];
};

type Macros = {
    cmds: Cmds[];
};

export type MockerJsonData = {
    commands: CommanObject;
    macros: Macros[];
};