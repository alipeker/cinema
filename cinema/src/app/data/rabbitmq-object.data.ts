import { Operation } from "./operation.model";

export class RabbitmqObject {
    operation: Operation;
    message: object | number;

    constructor(operation: Operation,  message: object) {
        this.operation = operation;
        this.message = message;
    }
}
