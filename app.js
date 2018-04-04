'use strict';

let MyGrid = new Grid({
    wrapper: 'body',
    columns: ['column 1', 'column 2', 'column 3', "column 4"],
    rows: [[ 1, 'data ba', 'data ma', 'data za'],
        [ 10, 'data zb', 'data jb', 'data vb'],
        [1, 'data ac', '10', 'data ac'],
        [2, 'data yd', 'data ed', 'data td'],
        [10, 'data se', 8, 'data de'],
        [6, 'data mf', 9, 'data af']],
    caption: 'Table name'
});

MyGrid.deleteRow();
MyGrid.addRow();
MyGrid.sortRows();

console.log(MyGrid.table);

