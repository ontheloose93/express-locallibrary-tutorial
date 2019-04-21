var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
var moment = require('moment');
var async = require ('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res) {
   

    BookInstance.find({})
    .populate('book')
    .exec(function (err, list_bookinstance) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('bookinstance_list', { title: 'BookInstance List', bookinstance_list: list_bookinstance });
    });
    
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res) {

    
    BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
      if (err) { return next(err); }
      if (bookinstance==null) { // No results.
          var err = new Error('Book copy not found');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      res.render('bookinstance_detail', { title: 'Book:', bookinstance:  bookinstance});
    })
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next) {

    Book.find({})
    .exec(function (err, books) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('bookinstance_form', { title: 'BookInstance Create', books });
    });

};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    
    // Validate fields.
    body('books', 'Book must be specified').isLength({ min: 1 }).trim(),
    body('imprint', 'imprint must not be empty.').isLength({ min: 1 }).trim(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
  
    // Sanitize fields.
    sanitizeBody('book').escape(),
    sanitizeBody('imprint').escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),
    
    function(req, res, next) {

      // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var bookInstance = new BookInstance(
          { book: req.body.books,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
           });

        if(!errors.isEmpty()){
            Book.find({})
                .exec(function (err, books) {
                  if (err) { return next(err); }
                    //Successful, so render
                    res.render('bookinstance_form', { title: 'BookInstance Create Failed', books, bookInstance, errors : errors.array() });
            }); 
            return;
        }
        else{  
          // No errors so we can sacve the data in the data based
          bookInstance.save(function (err) {
                        if (err) { return next(err); }
                       
                      //successful - redirect to new book record.
                     res.redirect(bookInstance.url);
          });
      }
      
    }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res) {


    async.parallel({
        bookinstance: function(callback) {
            BookInstance.findById(req.params.id).exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.bookinstance==null) { // No results.
            res.redirect('/catalog/bookinstances');
        }
        // Successful, so render.
        res.render('bookinstance_delete', { title: 'Delete Book Instance', bookinstance: results.bookinstance } );
    });
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res) {

  async.parallel({
        bookinstance: function(callback) {
            BookInstance.findById(req.params.id).exec(callback)
        },
    }, function(err, results) {
            if (err) { return next(err); }

                // Author has no books. Delete object and redirect to the list of authors.
                BookInstance.findByIdAndRemove(req.body.bookinstanceid, function deleteBookInstance(err) {
                    if (err) { return next(err); }
                    // Success - go to author list
                    res.redirect('/catalog/bookinstances')
                })
            
        });
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res) {

  async.parallel({
      books:function(callback) {
             Book.find({}).exec(callback)       
      },
      book_instance:function(callback) {    
            book_instance: BookInstance.findById(req.params.id)
            .exec(callback)
      }
    }, function(err, results){
            if (err) { return next(err); }
            console.log()
            res.render('bookinstance_form', { title: 'BookInstance Update', books: results.books, bookInstance: results.book_instance });
      }

)};


// Handle bookinstance update on POST.
exports.bookinstance_update_post = [ 
    // Validate fields.
    body('books', 'Book must be specified').isLength({ min: 1 }).trim(),
    body('imprint', 'imprint must not be empty.').isLength({ min: 1 }).trim(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
  
    // Sanitize fields.
    sanitizeBody('book').escape(),
    sanitizeBody('imprint').escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),
    
    function(req, res, next) {

      // Extract the validation errors from a request.
        const errors = validationResult(req);
        console.log('errors :' +errors);

        // Create a Book object with escaped and trimmed data.
        var bookinstance = new BookInstance(
          { book: req.body.books,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
            _id : req.params.id
           });

        if(!errors.isEmpty()){
            Book.find({})
                .exec(function (err, books) {
                  if (err) { return next(err); }
                    //Successful, so render
                    console.log('there');
                    res.render('bookinstance_form', { title: 'BookInstance Update Failed', books, bookInstance: bookinstance, errors : errors.array() });
            }); 
            return;
        }
        else{  

          // Data from form is valid. Update the record.
            BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function (err,thebookinstance) {
                if (err) { return next(err); }
                   // Successful - redirect to book detail page.
                   console.log('here');
                   res.redirect(thebookinstance.url);
                });
          
       }
      
    }
];




