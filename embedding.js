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
  //author: authorSchema,
  author: {
    type: authorSchema,
    required: true,
  },
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse(name, author) {
  try {
    const course = new Course({
      name,
      author,
    });
    console.log(course);

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

// the author is a subdocument
// these subdocument are not save in their own
// they can only be saved in the context of their parents

// createCourse(
//   'Node.js',
//   new Author({ name: 'Moslem', bio: 'my bio', website: 'my webiste' })
// );

// async function updateAuthor(courseId) {
//   try {
//     const course = await Course.findById(courseId);
//     course.author.name = 'Moslem Ajra';
//     await course.save(); // wrong code: we cannot do course.author.save()
//   } catch (error) {}
// }

// updateCourse directly on the database
async function updateAuthor(courseId) {
  try {
    await Course.findByIdAndUpdate(courseId, {
      $set: {
        'author.name': 'John Smith',
      },
    });
  } catch (error) {
    console.log(error);
  }
}

// remove a subdocument
async function removeAuthor(courseId) {
  try {
    await Course.findByIdAndUpdate(courseId, {
      $unset: {
        author: '',
      },
    });
  } catch (error) {}
}

//listCourses()
//updateAuthor('672674c68257b896564380b3');
removeAuthor('672674c68257b896564380b3');
