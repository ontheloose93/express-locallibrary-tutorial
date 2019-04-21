var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function () {
	var dob = this.date_of_birth ? moment(this.date_of_birth).format('MMMM Do, YYYY') : '';
	var dod = this.date_of_death ? moment(this.date_of_death).format('MMMM Do, YYYY') : '';
	// return dob.slice(0,4);
	// return dob + ' - ' + dod ;
	// return  (dod.getYear() - dob.getYear()).toString();
  // return (this.date_of_death  .getYear() - this.date_of_birth.getYear()).toString();
  return 'lifespan : ' +dob + ' - ' + dod;
});

// Virtual for author's date_of_birth formated
AuthorSchema
.virtual('date_of_birth_formated')
.get(function () {
	var dob = this.date_of_birth ? moment(this.date_of_birth).format('MMMM Do, YYYY') : '';
	
  return dob;
});

// Virtual for author's date_of_birth formated
AuthorSchema
.virtual('date_of_birth_formated2')
.get(function () {
  var dob = this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : '';
  
  return dob;
});


// Virtual for author's date_of_death formated
AuthorSchema
.virtual('date_of_death_formated')
.get(function () {
		var dod = this.date_of_death ? moment(this.date_of_death).format('MMMM Do, YYYY') : '';
	
  return dod;
});
// Virtual for author's date_of_death formated
AuthorSchema
.virtual('date_of_death_formated2')
.get(function () {
    var dod = this.date_of_death ? moment(this.date_of_death).format('YYYY-MM-DD') : '';
  
  return dod;
});


// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});



//Export model
module.exports = mongoose.model('Author', AuthorSchema);