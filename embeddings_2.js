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
  authors: [authorSchema],
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse(name, authors) {
  try {
    const course = new Course({
      name,
      authors,
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

async function addAuthor(courseId, author) {
  try {
    const course = await Course.findById(courseId);
    course.authors.push(author);
    await course.save();
  } catch (error) {
    console.error(error);
  }
}

async function removeAuthor(courseId, authorId) {
  try {
    const course = await Course.findById(courseId);
    const author = course.authors.id(authorId);
    course.authors = course.authors.filter((author) => author.id !== authorId);
    await course.save();
  } catch (error) {
    console.error(error);
  }
}

// the author is a subdocument
// these subdocument are not save in their own
// they can only be saved in the context of their parents

// createCourse('Node.js', [
//   new Author({ name: 'Moslem', bio: 'my bio', website: 'my webiste' }),
//   new Author({ name: 'John', bio: 'John bio', website: 'John webiste' }),
// ]);
//listCourses()
//updateAuthor('672674c68257b896564380b3');
//removeAuthor('672674c68257b896564380b3');
// addAuthor(
//   '6726c54fb19ee25fbd5f9962',
//   new Author({
//     name: 'Adam Smith',
//     bio: 'He is Adam Smith',
//     website: 'www.a-smith.com',
//   })
// );

//removeAuthor('6726c54fb19ee25fbd5f9962', '6726c59d942a41e2b8662394');
