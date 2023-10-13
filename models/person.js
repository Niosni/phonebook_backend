require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })


function phonenumberValidator (val) {
    return /\d{2,3}-\d{5,12}/.test(val)
}
const errorMessage =
    'Number must be a valid finnish phone number; "x-y" where x is 2-3 digits and y is 5-12 digits.'
const custom = [phonenumberValidator, errorMessage]
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
    },
    phonenumber: {
        type: String,
        minlength: 8,
        maxlength: 16,
        validate: custom
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person',personSchema)