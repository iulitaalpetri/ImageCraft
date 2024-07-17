import { DetectedFaces } from "./DetectedFaces.model";

export class DetectedObject {
    // Define properties here when ready
  }
  

  
  // Photo.ts
  export class Photo {
    id: number; // Assuming there's an id field that uniquely identifies a photo
    image: string; // URL to the image file
    date: Date; // The date the photo was added
    detectedObjects: DetectedObject[]; // Array of detected objects
    detectedFaces: DetectedFaces[]; // Array of detected faces
    cats: boolean; 
    dogs: boolean;

    // constructor 
    constructor(image: string, date: Date, detectedObjects: DetectedObject[], detectedFaces: DetectedFaces[]) {
      this.image = image;
      this.date = date;
      this.detectedObjects = detectedObjects;
      this.detectedFaces = detectedFaces;
    }
  }
  