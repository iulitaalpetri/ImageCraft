export class DetectedObject {
    // Define properties here when ready
  }
  
  // DetectedFace.ts (placeholder)
  export class DetectedFace {
    // Define properties here when ready
  }
  
  // Photo.ts
  export class Photo {
    id: number; // Assuming there's an id field that uniquely identifies a photo
    image: string; // URL to the image file
    date: Date; // The date the photo was added
    detectedObjects: DetectedObject[]; // Array of detected objects
    detectedFaces: DetectedFace[]; // Array of detected faces

    // constructor 
    constructor(image: string, date: Date, detectedObjects: DetectedObject[], detectedFaces: DetectedFace[]) {
      this.image = image;
      this.date = date;
      this.detectedObjects = detectedObjects;
      this.detectedFaces = detectedFaces;
    }
  }
  