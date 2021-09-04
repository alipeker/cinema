export class FileResponse {
    name = "";
    uri = "";
    type = "";
    size = 0;

    constructor(name = "", uri = "", type = "", size = 0) {
        this.name = name;
        this.uri = uri;
        this.type = type;
        this.size = size;
    }
}
