const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const nameArg = process.argv[3]
const numberArg = process.argv[4]

const url =
  `mongodb+srv://niklasniemela:${password}@cluster0.8ybidbt.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  phonenumber: String,
})

const Person = mongoose.model('Person', personSchema)


// Print all persons
if (process.argv.length<4) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else if (nameArg && numberArg){
  const person = new Person({
    name: nameArg,
    phonenumber: numberArg,
  })
  
  // Add a person
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.phonenumber} to phonebook`)
    mongoose.connection.close()
  })
}