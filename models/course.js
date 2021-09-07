const { v4: uuid } = require('uuid');
const fs = require('fs');
const path = require('path');

class Course {
  constructor(title, price, imageUrl) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.id = uuid();
  }

  toJSON() {
    return {
      title: this.title,
      price: this.price,
      imageUrl: this.imageUrl,
      id: this.id,
    };
  }

  static async update(course) {
    const courses = await Course.getAll();
    const idx = courses.findIndex(c => c.id === course.id);
    courses[idx] = course;
    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(__dirname, '..', 'data', 'courses.json'),
        JSON.stringify(courses),
        err => {
          if (err) reject(err);
          resolve();
      });
    });
  }

  async save() {
    const courses = await Course.getAll();;
    courses.push(this.toJSON());
    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(__dirname, '..', 'data', 'courses.json'),
        JSON.stringify(courses),
        err => {
          if (err) reject(err);
          resolve();
      });
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        'utf-8',
        (err, content) => {
          if (err) reject(err);
          resolve(JSON.parse(content));
        }
      );
    });
  }

  static async getById(id) {
    const all = await Course.getAll();
    return all.find(c => c.id === id);
  }
}

module.exports = Course;
