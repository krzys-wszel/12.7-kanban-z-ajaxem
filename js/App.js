$(function () {
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
                success: function (response) {
                    setupColumns(response.columns);
                }
            });
        }

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
