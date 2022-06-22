var BookService = {
  init: function () {
    let form_add_book = document.getElementById('addBookForm');
    // FORM: submit handler
    $(form_add_book).validate({
      submitHandler: function (form) {
        var entity = Object.fromEntries(new FormData(form).entries());
        // console.log("submitting: "+JSON.stringify(entity));
        BookService.addBook(entity);
      },
    });
    // FORM: submit handler

    BookService.list();
  },

  //LIST BOOKS
  list: function () {

    // GET BOOKS
    $.get("./rest/books_with_author", function (books) {

      // console.log("book found!");
      $("#items_row").html("");
      var html = "";
      var html_title;
      for (let i = 0; i < books.length; i++) {

          let dateStatusString = BookService.convertDate(books[i].release_date.toString());
          if (books[i].source == null || books[i].source == "") {
            html_title = `
              <h5 class="card-title" style="font-size: 14px;>
              <a style="color: black; text-decoration: none;" data-bs-toggle="tooltip" data-bs-placement="bottom"
              title="`+ books[i].name + `\n(E-book doesn't exist)">` + books[i].name + `
              </a>
              </h5>
              `;
          }
          else {
            html_title = `
              <h5 class="card-title text-nowrap text-truncate" style="font-size: 14px;">
              <a href="`+ books[i].source + `" target="_blank" style="color: black; text-decoration: none;" data-bs-toggle="tooltip" data-bs-placement="bottom"
              title="`+ books[i].name + `">` + books[i].name + `
              </a>
              </h5>
              `;
          }

          html +=
            `
            
          <!-- Item -->
          <div class="col-4 col-sm-4 col-md-3 col-lg-3 col-xl-2 col-xxl-2">
            <div class="card border-primary mb-3">
              <div class="book_container">
                <img src="`+ books[i].cover + `" class="card-img-top book_media"
                  alt="Cover of `+ books[i].name + `" style="width: 100%; height: 100%;"/>
              </div>
              <div class="card-body">
              `+ html_title + `
                <a href="`+ "./author.html?id=" + books[i].author_id + `" class="card-text" style="color: black; text-decoration: none; font-size: 12px;">` +  books[i].author_name + `
                </a>
                <div class="row" style="padding-bottom: 10px;">
                    <time date="`+ books[i].release_date + `" style="font-size: 10px; text-align: right">` + dateStatusString + `</time>
                </div>
                <div
                  class="btn-group"
                  role="group"
                  aria-label="Basic outlined example"
                  style="width: 100%"
                >
                  <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#editBookModal" onclick="BookService.editBook(`+ books[i].id + `);">
                    Edit
                  </button>
  
                  <button id="delete`+ books[i].id + `" type="button" class="btn btn-outline-danger" onclick="BookService.deleteBook(` + books[i].id + `);">
                    Delete
                  </button>
  
                </div>
              </div>
            </div>
          </div>
        <!-- End: Item -->
  
            `;
      }
      $("#item_row").html(html);


    });// End: GET BOOKS
  },

  convertDate: function (release_date) {
    // console.log(release_date)
    var dateParts = release_date.substr(0, 10).split("-");
    // console.log(dateParts[0]);
    // console.log(dateParts[1]);
    // console.log(dateParts[2]);
    let date = new Date(
      dateParts[0],
      dateParts[1] - 1,
      dateParts[2]
    );
    let current = new Date();
    // console.log("date after conversion: " + date.toDateString());
    return this.dateStatus(date);
  },

  dateStatus: function (date) {
    let current = new Date();

    if (date.getFullYear() - current.getFullYear() == 0) {
      // same year
      if (date.getMonth() - current.getMonth() == 0) {
        // same month
        let dayDifference = date.getDate() - current.getDate();
        switch (dayDifference) {
          case 0: //today
            //custom local time format
            let localTime =
              date
                .toLocaleTimeString()
                .substring(0, date.toLocaleTimeString().length - 6) +
              date
                .toLocaleTimeString()
                .substring(
                  date.toLocaleTimeString().length - 3,
                  date.toLocaleTimeString().length
                );
            return "today at " + localTime;

          case 1: //tomorrow
            return "tomorrow";

          case -1: //yesterday
            return "yesterday";

          default:
            return date
              .toDateString()
              .substring(4, date.toDateString().length - 5);
        }
      }
    } else {
      // different year
      return date.toDateString().substring(4);
    }
  }  //End: LIST books
  ,

  //ADD
  addBook: function (book) {
    $("#addBookForm_submitButton").attr("disabled", "true");
    $.ajax({
      url: 'rest/books',
      type: 'POST',
      data: JSON.stringify(book),
      contentType: "application/json",
      dataType: "json",
      success: function (result) {
        var html = `
        <!-- Loading Spinner -->
        <div class="d-flex justify-content-center text-primary">
          <div class="spinner-border" role="status">
            <span class="sr-only"></span>
          </div>
        </div>
        <!-- End: Loading Spinner -->
`
        $("#items_row").html(html);
        BookService.list(); // perf optimization
        $("#addBookForm_submitButton").removeAttr("disabled");
        $("#addBookModal").modal("hide");
        $('#addBookForm').trigger("reset");
      }
    });
  }  //End: ADD
  ,

  //EDIT
  editBook: function (id) {
    console.log("editBook function!");

    // FORM: submit handler
    let form_edit_book = document.getElementById('editBookForm');
    $(form_edit_book).validate({
      submitHandler: function (form) {
        var entity = Object.fromEntries(new FormData(form).entries());
        console.log("submitting: "+JSON.stringify(entity));
        BookService.updateBook(id, entity);
      },
    });
    // End: FORM: submit handler

    // FORM: fill with old entries
    // GET BOOK
    $.get("./rest/books/" + id, function (book) {
      $("#input_name_edit").val(book.name);
      $("#input_author_id_edit").val(book.author_id);
      $("#input_language_edit").val(book.language);
      $("#input_cover_edit").val(book.cover);
      $("#input_source_edit").val(book.source);
      $("#input_release_date_edit").val(book.release_date);
    });// End: GET BOOK
      // End: FORM: fill with old entries

  }//End: EDIT
  ,

  updateBook: function (id, book) {
    console.log("updateBook function!");

    $("#editBookForm_submitButton").attr("disabled", "true");
    $.ajax({
      url: 'rest/books/' + id,
      type: 'PUT',
      data: JSON.stringify(book),
      contentType: "application/json",
      dataType: "json",
      success: function (result) {
        var html = `
        <!-- Loading Spinner -->
        <div class="d-flex justify-content-center text-primary">
          <div class="spinner-border" role="status">
            <span class="sr-only"></span>
          </div>
        </div>
        <!-- End: Loading Spinner -->
`
        $("#items_row").html(html);
        BookService.list(); // perf optimization
        $("#editBookForm_submitButton").removeAttr("disabled");
        $("#editBookModal").modal("hide");
        $('#editBookForm').trigger("reset");
      }
    });
  },

  //DELETE
  deleteBook: function (id) {
    $("#delete" + id).attr("disabled", "true");
    console.log("delete item " + id);

    $.ajax({
      url: 'rest/books/' + id,
      type: 'DELETE',
      success: function (result) {
        var html = `
        <!-- Loading Spinner -->
        <div class="d-flex justify-content-center text-primary">
          <div class="spinner-border" role="status">
            <span class="sr-only"></span>
          </div>
        </div>
        <!-- End: Loading Spinner -->
`
        $("#items_row").html(html);
        BookService.list();
        console.log(result);
      },
      error: function () {
        console.log("Could not delete it! Please try again...");
        $("#delete" + id).removeAttr("disabled");
      }

    });


  },
  //End: DELETE

  get_books: async function () {

    // GET BOOKS
    $.get("./rest/books", function (books) {

    });// End: GET BOOKS
  },

  get_author_of_book: function ($book_id) {

    // GET AUTHOR OF BOOK
    $.get("./rest/author_of_book/" + $book_id, function (author) {

    });// End: GET AUTHOR OF BOOK

  },

  get_book: function ($book_id) {

    // GET BOOK
    $.get("./rest/books/" + $book_id, function (book) {
    });// End: GET BOOK

  },



};
