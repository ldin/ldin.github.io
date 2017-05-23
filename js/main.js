$(document).ready(function(){

    var app = new BookLibrary();
    app.init();

});


var BookLibrary =  function () {
    var that = this;
    var books = [];
    that.maxId = 0;
    var bookTemplate='<article class="col-sm-6">' +
        '        <div class="book">' +
        '          <p>Name:  <span class="book_name"> </span></p>' +
        '          <p>Автор: <span class="book_author"></span></p>' +
        '          <div class="row editing">' +
        '            <a href="#" class="btn js-edit">Edit</a>' +
        '            <a href="#" class="btn js-del">Del</a>' +
        '          </div>' +
        '        </div>' +
        '      </article>';
    var $booksList = $('.js-viewBooks');
    
    var $bookform = $('#bookForm');
    var $searchForm = $('#searchForm');

    this.init = function(){
        if (!supportsLocalStorage()) { return false; }

        that.maxId = localStorage['books.maxid'] || 0;

        for(var i=0; i<=that.maxId; i++ ){
            book = localStorage.getItem("books." + i);
            if(!book) continue;
            book = JSON.parse(book);

            that.showBook(book);
        }

        $('.js-saveBook').on('click', function(e){
            e.preventDefault();
            that.saveBookForm(this);
        });

        var search = searchNameInList();
        $searchForm.on('input keyup',function(e) {
            search($(this).val());
        });
    }

    function supportsLocalStorage() {
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
      }
    }

    this.fillForm = function(id){

        var inputs = $bookform.find('input');

        if(id == null){
            for(var i= inputs.length;i>=0; i-- ){
                if($(inputs[i]).attr('type')=='submit') continue;
                $(inputs[i]).val('');
            }
            $bookform.removeAttr('data-id');
            return;
        }

        var book = that.getBookById(id);
        $bookform.attr('data-id',id);
        for(var i= inputs.length;i>=0; i-- ){
            if(!$(inputs[i]).attr('name')) continue;
            var name = $(inputs[i]).attr('name');
            $(inputs[i]).val(book[name]);
        }

    }

    this.saveBookForm = function(obj){

        var form = obj.closest('form');
        var inputs = $(form).find('input');
        var book = {};
        book.id = $(form).attr('data-id') || ++that.maxId;

        for(var i= inputs.length;i>=0; i-- ){
            if(!$(inputs[i]).attr('name')) continue;
            book[$(inputs[i]).attr('name')] = $(inputs[i]).val();
        }
        //console.log(book);
        that.saveBookStorage(book);
        that.showBook(book);
        that.fillForm(null);
    }

    this.saveBookStorage = function(book){
        localStorage.setItem("books.maxid",that.maxId);
        localStorage.setItem( "books." + book.id, JSON.stringify( book ) );
    }

    this.removeBookStorage = function(id){
        if(!confirm('Вы действительно хотите удалить книгу?')) return;
        that.delBookById(id);
        that.removeBook(id);
    }

    this.getBookById = function (id) {
        return JSON.parse(localStorage.getItem( "books." + id ));
    }
    this.delBookById = function (id) {
        localStorage.removeItem( "books." + id);
    }

    this.showBook = function (book) {

        var view = $booksList.find('article#'+book.id);
        if(view.length == 0) {
            view = $(bookTemplate).clone().attr('id',book.id);
            view.find('.js-edit').bind('click', function(e){
                e.preventDefault();
                that.fillForm( book.id)
            });
            view.find('.js-del').bind('click', function(e){
                e.preventDefault();
                that.removeBookStorage(book.id);
            });
            $booksList.append(view);
        }
        view.find('.book_name').html(book.name);
        view.find('.book_author').html(book.author);


    }

    this.removeBook = function (id) {
        $booksList.find('article#'+id).remove();
    }
    
    function searchNameInList() {

        var oldVal = '';
        var books = $booksList.find('article') || {};

        function func(value) {

            if(oldVal == value) return;
            oldVal = value;

            for (var i=0; i<books.length; i++){

                var name = $(books[i]).find('.book_name').html();
                $(books[i]).removeClass('hide');

                if(name && name.toLowerCase().indexOf(value.toLowerCase()) == -1 ) {
                    $(books[i]).addClass('hide');
                }
            }
        }
        return func;
    }


}

