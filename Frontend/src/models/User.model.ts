export class User {
    id?: number;
    username: string;
    email: string;
    photos: any[];  // Assuming you will replace 'any' with the actual type later
    persons: any[]; // Assuming you will replace 'any' with the actual type later
  
    constructor(email: string) {
      this.email = email;
      this.username = '';
      this.photos = [];
      this.persons = [];
    }
  }
  