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


        columnDelete.on('click', function () {
            self.deleteColumn();
        });

        columnEdit.on('click', function () {
            self.editColumn();
        });

        columnAddCard.on('click', function (event) {
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
                    success: function (response) {
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
createCard: function (card) {
    this.element.children('ul').append(card.element);
},
deleteColumn: function () {
    var self = this;
    $.ajax({
        url: baseUrl + '/column/' + self.id,
        method: 'DELETE',
        success: function (response) {
            self.element.remove();
        }
    });
},
editColumn: function () {
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
            success: function (response) {
                self.element.children("h2").text(newName);
                self.name = newName;
            }
        });
    }
}
};


