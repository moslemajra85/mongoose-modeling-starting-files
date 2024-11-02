const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to mongodDb...'))
  .catch((error) => console.error('We could not connect to mongodb: ', error));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model('Author', authorSchema);

const courseSchema = new mongoose.Schema({
  name: String,
 
});

const Course = mongoose.model('Course', courseSchema);

async function createAuthor(name, bio, website) {
  try {
    const author = new Author({
      name,
      bio,
      website,
    });

    const result = await author.save();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}
async function createCourse(name, author) {
  try {
    const course = new Course({
      name,
      author,
    });

    const result = await course.save();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

async function listCourses() {
  try {
    const courses = await Course.find().select('name -_id');
    console.log(courses);
  } catch (error) {
    console.log(error);
  }
}

//createAuthor("Moslem", "My bio", "My website")
//createCourse('Node.js', '67265a09d2a2f1497af75416');
//listCourses()
