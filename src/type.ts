import AstType from './AstType'

export interface IBlock {
    content: string,
    comment?: string,
    children: IBlock[],
}

export interface IAST extends IBlock {
    children: IAST[],
    type: AstType,
    deep: number,
    command: string,
    args: string[],
    comment: string,
}
