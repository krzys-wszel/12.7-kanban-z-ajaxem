var board = {
    name: 'Task board',
    createColumn: function (column) {
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

$('.btn-create-column').on('click', function () {
    var columnName = prompt('Enter a column name');
    if (columnName) {
        $.ajax({
            url: baseUrl + '/column',
            method: 'POST',
            data: {
                name: columnName
            },
            success: function (response) {
                var column = new Column(response.id, columnName);
                board.createColumn(column);
            }
        });
    }
});
