export class DetectedFaces{
    id: number;
    image: string;
    emotion: string;

    constructor(image: string, emotion: string){
        this.image = image;
        this.emotion = emotion;
    }
}

