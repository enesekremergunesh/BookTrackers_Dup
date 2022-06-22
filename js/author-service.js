var AuthorService = {
  init: function () {
    AuthorService.list();
  },

  list: function () {

    //GET BOOK ID FROM URL
    let params = new URLSearchParams(location.search);
    $id = params.get('id');
    console.log('id: ' + $id);

    //CALL DAO FUNCTION TO GET ALL BOOKS OF CURRENT AUTHOR
    //GET BOOKS BY AUTHOR
    $.get("./rest/author_with_books/" + $id, function (author_with_books) {
      console.log(author_with_books[0].name);
      $("#AlbumItemRow").html("");
      var html = "";
      for (let i = 0; i < author_with_books.length; i++) {
        let dateStatusString = AuthorService.convertDate(author_with_books[i].book_release_date.toString());
        if (author_with_books[i].book_source == null || author_with_books[i].book_source == "") {
          html_title = `
            <h5 class="card-title" style="font-size: 14px;>
            <a style="color: black; text-decoration: none;" books-bs-toggle="tooltip" books-bs-placement="bottom"
            title="`+ author_with_books[i].book_name + `\n(E-book doesn't exist)">` + author_with_books[i].book_name + `
            </a>
            </h5>
            `;
        }
        else {
          html_title = `
            <h5 class="card-title text-nowrap text-truncate" style="font-size: 14px;">
            <a href="`+ author_with_books[i].book_source + `" target="_blank" style="color: black; text-decoration: none;" books-bs-toggle="tooltip" books-bs-placement="bottom"
            title="`+ author_with_books[i].book_name + `">` + author_with_books[i].book_name + `
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
              <img src="`+ author_with_books[i].book_cover + `" class="card-img-top book_media"
                alt="Cover of `+ author_with_books[i].book_name + `" style="width: 100%; height: 100%;"/>
            </div>
            <div class="card-body">
            `+ html_title + `
              <div class="row">
                  <time date="`+ author_with_books[i].book_release_date + `" style="font-size: 10px; text-align: right">` + dateStatusString + `</time>
              </div>
            </div>
          </div>
        </div>
      <!-- End: Item -->

          `;
      }
      $("#item_row").html(html);

      //SET AUTHOR BODY
      $("#AuthorBody").html("");
      var html = `
			<!-- Author-Profile Body -->
			<div class="col-md-4 mx-auto">
			<!-- Author-Profile Body -->
			<img src="`+ author_with_books[0].cover + `" class="rounded img-fluid" style="height: 15rem;" alt="Author picture">
			</div>
			<div class="col-md-8 mx-auto">
			<h1 class="fw-light">`+ author_with_books[0].name + `</h1>
			<p id="bio_p" class="lead text-muted">`+ author_with_books[0].bio + `</p>
			</div>
			<!-- End: Author-Profile Body -->
			`;
      $("#AuthorBody").html(html);//END OF SET AUTHOR BODY

      // MODIFY: decrease author bio font size if too long
      console.log("fontsize = " + parseInt($("#bio_p").html().length) + " " + (parseInt($("#bio_p").css("font-size")) - parseInt(parseInt($("#bio_p").html().length) / 200)));
      if ($("#bio_p").html().length > 250) {
        $("#bio_p").css("font-size", (parseInt($("#bio_p").css("font-size")) - parseInt(parseInt($("#bio_p").html().length) / 200)) + "px");
      }
      // End: MODIFY: decrease author bio font size if too long
    });//END OF GET BOOKS BY AUTHOR

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

  author_body: function () {
    /*
    This function gets book id from url, and gets id of author for the book,
    then gets all the books of the author, then list them on the page
    */
    let params = new URLSearchParams(location.search);
    $id = params.get('id');
    // console.log('id: ' + $id);
    $.get("./rest/author_by_book/" + $id, function (author) {


    });
  },
}