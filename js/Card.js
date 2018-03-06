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

        cardDeleteBtn.on('click', function () {
            self.removeCard();
        });

        cardEditBtn.on('click', function () {
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
    removeCard: function () {
        var self = this;
        $.ajax({
            url: baseUrl + '/card/' + self.id,
            method: 'DELETE',
            success: function () {
                self.element.remove();
            }
        });
    },

    editCard: function () {
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
                success: function (response) {
                    self.element.children("p").text(newCardName);
                    self.name = newCardName;
                }
            });
        }
    }
};
