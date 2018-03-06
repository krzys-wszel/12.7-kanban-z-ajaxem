$(function() { 
var baseUrl = 'https://kodilla.com/pl/bootcamp-api';
var myHeaders = {
  'X-Client-Id': '2658',
  'X-Auth-Token': 'b7049dff284a5b441c81a9bc305e4aca'
};

$.ajaxSetup({
	headers: myHeaders
});

$.ajax({
  url: baseUrl + '/board',
  method: 'GET',
  success: function(response) {
    setupColumns(response.columns);
  }
});

function setupColumns(columns) {
  columns.forEach(function (column) {
		var col = new Column(column.id, column.name);
    board.createColumn(col);
    setupCards(col, column.cards);
  });
}

function setupCards(col, cards) {
	cards.forEach(function (card) {
    card = new Card(card.id, card.name, card.bootcamp_kanban_column_id);
    col.createCard(card);
  });
}

var board = {
	name: 'Task board',
	createColumn: function(column) {
	  this.element.append(column.element);
	  initSortable();
	},
	element: $('#board .column-container')
};

function initSortable() {
  $('.column-card-list').sortable({
    connectWith: '.column-card-list',
    placeholder: 'card-placeholder'
  }).disableSelection();
}

$('.btn-create-column').on('click', function(){
	var columnName = prompt('Enter a column name');
  if (columnName) {
    $.ajax({
    	url: baseUrl + '/column',
     	method: 'POST',
      data: {
        name: columnName
      },
   		success: function(response){
   			var column = new Column(response.id, columnName);
   			board.createColumn(column);
      }
    });
  }
});

function Card(id, name) {
	var self = this;
	
	this.id = id;
	this.name = name;
	this.element = createCard();

	function createCard() {
		var card = $('<li class="card"></li>');
		var cardDeleteBtn = $('<button class="btn-delete"><i class="fa fa-trash-o" aria-hidden="true"></i></button>');
		var cardEditBtn = $('<button class="btn-edit-card"><i class="fa fa-pencil" aria-hidden="true"></i></button>');
		var cardDescription = $('<p class="card-description"></p>');
		
		cardDeleteBtn.on('click', function(){
			self.removeCard();
		});

		cardEditBtn.on('click', function(){
			self.editCard();
		});
		
		card.append(cardDeleteBtn);
		card.append(cardEditBtn);
		cardDescription.text(self.name);
		card.append(cardDescription);
		return card;
	}
}

Card.prototype = {
	removeCard: function() {
		var self = this;
	    $.ajax({
	    	url: baseUrl + '/card/' + self.id,
	    	method: 'DELETE',
	     	success: function(){
	        	self.element.remove();
	      	}
	    });
	},

	editCard: function() {
		var self = this;
		var newCardName = prompt("Enter a new name of the card", self.name);
		var columnId = $(this.element).closest("div").attr('id');
		if (newCardName) {
			$.ajax({
				url: baseUrl + '/card/' + self.id,
				method: 'PUT',
				data: {
					id: self.id,
				    name: newCardName,
				    bootcamp_kanban_column_id: columnId
				},
				success: function(response){
					self.element.children("p").text(newCardName);
				self.name = newCardName;
				}
			});
		}
	}
};

function Column(id, name) {
	var self = this;
	
	this.id = id;
	this.name = name || 'No name given';
	this.element = createColumn();

	function createColumn() {
		var column = $('<div class="column"></div>').attr('id', self.id);
		var columnTitle = $('<h2 class="column-title">' + self.name + '</h2>');
		var columnCardList = $('<ul class="column-card-list"></ul>');
		var columnDelete = $('<button class="btn-delete"><i class="fa fa-trash-o" aria-hidden="true"></i></button>');
		var columnEdit = $('<button class="btn-edit-column"><i class="fa fa-pencil" aria-hidden="true"></i></button>');
		var columnAddCard = $('<button class="btn-add-card"><i class="fa fa-plus" aria-hidden="true"></i></i></button>');
		
		
		columnDelete.on('click', function() {
			self.deleteColumn();
		});

		columnEdit.on('click', function() {
			self.editColumn();
		});
		
		columnAddCard.on('click', function(event) {
			var cardName = prompt("Enter the name of the card");
			event.preventDefault();
			if (cardName) {
				$.ajax({
				    url: baseUrl + '/card',
				    method: 'POST',
				    data: {
				    name: cardName,
				    bootcamp_kanban_column_id: self.id
				    },
				    success: function(response) {
				    	var card = new Card(response.id, cardName);
				        self.createCard(card);
				    }
				});
			}
		});

		column.append(columnTitle)
			.append(columnDelete)
			.append(columnEdit)
			.append(columnAddCard)
			.append(columnCardList);
			return column;
	}
}

Column.prototype = {
	createCard: function(card) {
	 	this.element.children('ul').append(card.element);
	},
	deleteColumn: function() {
	  	var self = this;
	    $.ajax({
	      	url: baseUrl + '/column/' + self.id,
	      	method: 'DELETE',
	      	success: function(response){
	        	self.element.remove();
	      	}
    	});
	},
	editColumn: function() {
		var self = this;
		var newName = prompt("Enter a new name of the column", self.name);
		if (newName) {
			$.ajax({
				url: baseUrl + '/column/' + self.id,
				method: 'PUT',
				data: {
					id: self.id,
				    name: newName,
				},
				success: function(response){
					self.element.children("h2").text(newName);
				self.name = newName;
				}
			});
		}
	}
};

});