(function () {
    'use strict';

    class Grid {
        constructor(grid) {

            if (typeof grid === 'object' && grid.wrapper && grid.columns && grid.rows) {

                this.wrapper = document.querySelector(grid.wrapper);
                this.caption = grid.caption;


                if (Array.isArray(grid.columns) && grid.columns.length) {

                    this.columns = grid.columns;

                } else {
                    throw "Property columns is not Array or is an empty Array"
                }

                if (Array.isArray(grid.rows) && grid.rows.length) {

                    this.rows = grid.rows;

                } else {
                    throw "Property rows is not Array or is an empty Array"
                }
                this.table = this.createTable();
                this.addForm = this.createAddForm();

                this.sortingKeys = new Array(this.columns.length).fill(0);
                this.sortingDirection = new Array(this.columns.length).fill('none');

            } else {
                throw "Constructor takes an object with properties wrapper(element or element's selector), columns(array with columns), rows(array with rows's information)";
            }



        }

        createTable() {
            let fragment = document.createDocumentFragment();
            let table = document.createElement('table');
            let caption = document.createElement('caption');
            let tableHead = document.createElement('thead');
            let tableHeadRow = document.createElement('tr');
            let tableBody = document.createElement('tbody');

            table.dataset.id = 'table';
            table.appendChild(caption);
            table.appendChild(tableHead);
            table.appendChild(tableBody);
            tableHead.appendChild(tableHeadRow);
            tableHeadRow.dataset.id = 'tableHeadRow';
            tableBody.dataset.id = 'tableBody';
            caption.dataset.id = 'caption';
            caption.textContent = this.caption;

            for (let i = 0; i < this.columns.length; i++) {
                let tableHeadData = document.createElement('th');
                tableHeadData.classList.add('tableHeadData');
                tableHeadRow.appendChild(tableHeadData);
                tableHeadData.textContent = this.columns[i];
            }

            for (let i = 0; i < this.rows.length; i++) {
                let tableRow = document.createElement('tr');
                tableBody.appendChild(tableRow);
                tableRow.classList.add('row');

                for (let j = 0; j < this.columns.length; j++) {
                    let tableData = document.createElement('td');
                    tableRow.appendChild(tableData);
                    tableData.classList.add('tableData');
                    tableData.textContent = this.rows[i][j];
                }
            }
            fragment.appendChild(table);
            this.wrapper.appendChild(fragment);
            return table;
        }

        createAddForm() {
            let fragment = document.createDocumentFragment();
            let addForm = document.createElement('form');
            let addInput = document.createElement('input');
            let addInputLabel = document.createElement('label');
            let addButton = document.createElement('button');
            fragment.appendChild(addForm);
            addForm.appendChild(addInputLabel);
            addForm.appendChild(addInput);
            addForm.appendChild(addButton);
            addForm.classList.add('addForm');
            addForm.name = 'addForm';
            addInputLabel.classList.add('addInputLabel');
            addInput.name = 'addInput';
            addInput.type = 'text';
            addButton.type = 'submit';
            addButton.id = 'addButton';
            addButton.textContent = 'Add data';
            addInput.id = 'addInput';
            addInputLabel.textContent = `Add row cells`;
            addInputLabel.placeholder = `data 1, data 2, data 3`;
            addInputLabel.setAttribute('for', 'addInput');

            this.wrapper.appendChild(fragment);
            return addForm;
        }

        // handleEvent(event) {
        //     switch (event){
        //         'click':
        //             return "a";
        //     }
        // }

        sortRows() {
            const SORT_BTN_UP = document.createElement('button');
            const SORT_BTN_DOWN = document.createElement('button');
            let imgUp = new Image();
            let imgDown = new Image();
            imgUp.classList.add('iconSort');
            imgUp.classList.add('up');
            imgDown.classList.add('iconSort');
            imgDown.classList.add('down');
            imgUp.src = 'svg/arrowUp.svg';
            imgUp.height = '20';
            imgUp.width = '20';
            imgDown.src = 'svg/arrowDown.svg';
            imgDown.height = '20';
            imgDown.width = '20';
            SORT_BTN_UP.classList.add('buttonSort');
            SORT_BTN_UP.classList.add('up');
            SORT_BTN_UP.type = 'button';

            SORT_BTN_DOWN.classList.add('buttonSort');
            SORT_BTN_DOWN.classList.add('down');
            SORT_BTN_DOWN.type = 'button';

            SORT_BTN_UP.appendChild(imgUp);
            SORT_BTN_DOWN.appendChild(imgDown);

            let tableHeadData = document.querySelectorAll(`.tableHeadData`);

            for (let i = 0; i < tableHeadData.length; i++) {

                if (this.sortingDirection[i] === 'none') {
                    let sortBtnUp = SORT_BTN_UP.cloneNode(true);
                    sortBtnUp.name = `${i}`;
                    let sortBtnDown = SORT_BTN_DOWN.cloneNode(true);
                    sortBtnDown.name = `${i}`;
                    tableHeadData[i].appendChild(sortBtnUp);
                    tableHeadData[i].appendChild(sortBtnDown);
                }
            }


            let tableHeadRow = document.querySelector("[data-id = tableHeadRow]");

            tableHeadRow.onclick = () => {
                let tableBody = document.querySelector("[data-id = tableBody]");
                let columnNumber = event.target.closest('.buttonSort').name;

                if (event.target.matches('.up')) {
                    this.sortingKeys[columnNumber] = 1;
                    this.changeStringsNumbersToNumbers(columnNumber);

                    if (this.rows.every((el) => {
                            return typeof el[columnNumber] === 'number'
                        })) {
                        this.compareNumbersDirect(columnNumber);
                        } else if (this.rows.every((el) => {
                            return typeof el[columnNumber] === 'string'
                        })) {this.compareStringsDirect(columnNumber);
                    }  else {
                        this.compareNumbersStringsDirect(columnNumber);
                    }

                    for (let i = 0; i < this.columns.length; i++) {
                        this.sortingKeys[i] = (i === Number(columnNumber)) ? 1 : 0;
                        this.sortingDirection[i] = (i === Number(columnNumber)) ? 'up' : 'none';
                    }

                    tableBody.textContent = '';
                    for (let i = 0; i < this.rows.length; i++) {
                        let tableRow = document.createElement('tr');
                        tableBody.appendChild(tableRow);
                        tableRow.classList.add('row');

                        for (let j = 0; j < this.columns.length; j++) {
                            let tableData = document.createElement('td');
                            tableRow.appendChild(tableData);
                            tableData.classList.add('tableData');
                            tableData.textContent = this.rows[i][j];
                        }
                    }
                    this.table.appendChild(tableBody);
                }
                if (event.target.matches('.down')) {

                    this.sortingKeys[columnNumber] = 1;

                    this.changeStringsNumbersToNumbers(columnNumber);

                    if (this.rows.every((el) => {
                            return typeof el[columnNumber] === 'number'
                        })) {
                        this.compareNumbersReverce(columnNumber)
                    } else if (this.rows.every((el) => {
                            return typeof el[columnNumber] === 'string'
                        })) { this.compareStingsReverce(columnNumber)
                    } else {
                        this.compareNumbersStringsReverce(columnNumber);
                        }

                    for (let i = 0; i < this.columns.length; i++) {
                        this.sortingKeys[i] = (i === Number(columnNumber)) ? 1 : 0;
                        this.sortingDirection[i] = (i === Number(columnNumber)) ? 'down' : 'none';
                    }

                    tableBody.textContent = '';
                    for (let i = 0; i < this.rows.length; i++) {
                        let tableRow = document.createElement('tr');
                        tableBody.appendChild(tableRow);
                        tableRow.classList.add('row');

                        for (let j = 0; j < this.columns.length; j++) {
                            let tableData = document.createElement('td');
                            tableRow.appendChild(tableData);
                            tableData.classList.add('tableData');
                            tableData.textContent = this.rows[i][j];
                        }
                    }
                    this.table.appendChild(tableBody);
                }
            };
        }

        compareNumbersDirect(index){
            this.rows.sort((A, B) => {
                return A[index] - B[index];
            });
        }
        compareNumbersReverce(index){
            this.rows.sort((A, B) => {
                return B[index] - A[index];
            });
        }

        compareStringsDirect(index){
            this.rows.sort((A, B) => {
                if (A[index] < B[index]) {
                    return -1;
                }
                if (A[index] > B[index]) {
                    return 1;
                }
            });
        }
        compareStingsReverce(index){
            this.rows.sort((A, B) => {
                if (A[index] < B[index]) {
                    return 1;
                }
                if (A[index] > B[index]) {
                    return -1;
                }
            })
        }

        compareNumbersStringsDirect(index){
            let tempArrayNum = [];
            let tempArrayString = [];
            for (let i = 0; i < this.rows.length; i++) {
                if (!isNaN(Number(this.rows[i][index]))) {
                    tempArrayNum.push(this.rows[i]);
                    tempArrayNum.sort((A, B) => {
                        return A[index] - B[index];
                    });
                }
                else {
                    tempArrayString.push(this.rows[i]);
                    tempArrayString.sort((A, B) => {
                        if (A[index] < B[index]) {
                            return -1;
                        }
                        if (A[index] > B[index]) {
                            return 1;
                        }
                    });
                }
            }

            this.rows = tempArrayNum.concat(tempArrayString);
            console.log(this.rows);
            }

        compareNumbersStringsReverce(index){
            let tempArrayNum = [];
            let tempArrayString = [];
            for (let i = 0; i < this.rows.length; i++) {
                if (!isNaN(Number(this.rows[i][index]))) {
                    tempArrayNum.push(this.rows[i]);
                    tempArrayNum.sort((A, B) => {
                        return B[index] - A[index];
                    });
                }
                else {
                    tempArrayString.push(this.rows[i]);
                    tempArrayString.sort((A, B) => {
                        if (A[index] < B[index]) {
                            return 1;
                        }
                        if (A[index] > B[index]) {
                            return -1;
                        }
                    });
                }
            }
            this.rows = tempArrayNum.concat(tempArrayString);
            console.log(this.rows);
        }

        changeStringsNumbersToNumbers(index){
            for (let i = 0; i < this.rows.length; i++) {
                if (!isNaN(Number(this.rows[i][index]))) {
                    this.rows[i][index] = Number(this.rows[i][index]);
                }
            }
        }

        tableIsNotSorted() {
            this.sortingKeys.every((el) => {
                return !el;
            })
        }

        deleteRow() {
            this.wrapper.addEventListener('mouseover', () => {
                const CLOSE_BTN_TEMPLATE = document.createElement('button');
                CLOSE_BTN_TEMPLATE.textContent = 'delete row';
                CLOSE_BTN_TEMPLATE.type = 'button';
                CLOSE_BTN_TEMPLATE.classList.add('closeBtn');

                if (event.target.closest('tr.row')) {
                    let closeBtn = CLOSE_BTN_TEMPLATE.cloneNode(true);
                    this.wrapper.appendChild(closeBtn);
                    let row = event.target.closest('tr.row');
                    let coord = row.getBoundingClientRect();

                    closeBtn.style.top = (coord.top + 10) + 'px';
                    closeBtn.style.left = (coord.right - 5) + 'px';


                    closeBtn.onclick = () => {
                        this.rows.splice(row.rowIndex - 1, 1);
                        row.remove();
                        let closeBtns = document.querySelectorAll(`.closeBtn`);
                        for (let i = 0; i < closeBtns.length; i++) {
                            closeBtns[i].remove();
                        }
                    };
                }
            });

            this.wrapper.addEventListener('mouseout', () => {
                let closeBtn = document.querySelector(`.closeBtn`);
                if (closeBtn && event.relatedTarget !== closeBtn) {
                    closeBtn.remove();
                }
            });
        }



        addRow() {

            this.addForm.onsubmit = () => {
                let addInput = document.getElementById('addInput');
                event.preventDefault();
                event.stopPropagation();


                if (addInput && addInput.value.split(', ').length === this.columns.length) {
                    let addedRow = document.createElement('tr');
                    addedRow.classList.add('row');
                    let tableBody = document.querySelector("[data-id = tableBody]");

                    let addedDataInitial = addInput.value.split(', ');
                    let rowFragment = document.createDocumentFragment();
                    let addedDataCorrectType = [];


                    for (let i = 0; i < addedDataInitial.length; i++) {
                        let tableData = document.createElement('td');
                        tableData.classList.add('tableData');
                        addedRow.appendChild(tableData);
                        if (isNaN(Number(addedDataInitial[i]))) {
                            addedDataCorrectType.push(addedDataInitial[i])
                        } else {
                            addedDataCorrectType.push(Number(addedDataInitial[i]))
                        }
                        tableData.textContent = addedDataCorrectType[i];
                    }
                    rowFragment.appendChild(addedRow);



                    if (this.tableIsNotSorted()) {
                        tableBody.appendChild(rowFragment);
                        this.rows.push(addedDataCorrectType);
                        console.log('1');

                    }

                    if (!this.tableIsNotSorted()) {
                        let columnNumber;
                        let positionOfElements;

                        for (let i = 0; i < this.sortingKeys.length; i++) {

                            if (this.sortingKeys[i] === 1) {
                                columnNumber = i;
                            }
                        }

                        if (this.sortingDirection[columnNumber] === 'up') {
                            console.log((this.rows.every((el) => {
                                return typeof el[columnNumber] === 'number'
                            }) && !isNaN(Number(addedDataInitial[columnNumber]))));
                            console.log(this.rows.every((el) => {
                                return typeof el[columnNumber] === 'string'
                            }) && isNaN(Number(addedDataInitial[columnNumber])));
                            console.log(columnNumber);
                            console.log(this.rows);
                            // console.log();


                            if ((this.rows.every((el) => {
                                    return typeof el[columnNumber] === 'number'
                                }) && !isNaN(Number(addedDataInitial[columnNumber]))) || (this.rows.every((el) => {
                                    return typeof el[columnNumber] === 'string'
                                }) && isNaN(Number(addedDataInitial[columnNumber])))) {

                                if (addedDataCorrectType[columnNumber] < this.rows[columnNumber][0]) {
                                    console.log(this.rows);

                                    console.log(addedDataCorrectType[columnNumber]);
                                    console.log(this.rows[columnNumber][0]);
                                    console.log(addedDataCorrectType[columnNumber] < this.rows[columnNumber][0]);

                                    this.rows.unshift(addedDataCorrectType);
                                    tableBody.insertBefore(rowFragment, tableBody.children[0]);
                                    console.log(tableBody.children[0]);
                                    console.log('2');


                                } else if (addedDataCorrectType[columnNumber] > this.rows[this.rows.length - 1][columnNumber]) {
                                    console.log(this.rows);

                                    console.log(addedDataCorrectType[columnNumber]);
                                    console.log(this.rows[this.rows.length - 1][columnNumber]);
                                    console.log(addedDataCorrectType[columnNumber] > this.rows[this.rows.length - 1][columnNumber]);

                                    this.rows.push(addedDataCorrectType);
                                    tableBody.appendChild(rowFragment);
                                    console.log('3');

                                } else {
                                    for (let i = 0; i < (this.rows.length - 1); i++) {
                                        if (this.rows[i][columnNumber] < addedDataCorrectType[columnNumber] && addedDataCorrectType[columnNumber] < this.rows[i + 1][columnNumber]) {
                                            positionOfElements = i + 1;
                                            console.log(addedDataCorrectType[columnNumber] < this.rows[i + 1][columnNumber]);
                                            console.log(this.rows[i][columnNumber] < addedDataCorrectType[columnNumber]);
                                            break;
                                        }
                                    }

                                    this.rows.splice(positionOfElements, 0, addedDataCorrectType);
                                    tableBody.insertBefore(rowFragment, tableBody.children[positionOfElements]);

                                    console.log(tableBody.children[0]);
                                    console.log('4');
                                    console.log(addedDataCorrectType[columnNumber]);
                                    console.log(this.rows[columnNumber][0]);


                                }
                            } else {

// добавить как числа и строки


                            }

                            // if (!isNaN(Number(this.rows[i][index]))) {
                            //     this.rows[i][index] = Number(this.rows[i][index]);
                            // }

                            // if (addedDataCorrectType[columnNumber] < this.rows[columnNumber][0]) {
                            //     this.rows.unshift(addedDataCorrectType);
                            //     tableBody.insertBefore(rowFragment, tableBody.children[0]);
                            //
                            // } else if (addedDataCorrectType[columnNumber] > this.rows[this.rows.length - 1][columnNumber]) {
                            //     this.rows.push(addedDataCorrectType);
                            //     tableBody.appendChild(rowFragment);
                            //
                            // } else {
                            //     for (let i = 0; i < (this.rows.length - 1); i++) {
                            //         if (this.rows[i][columnNumber] < addedDataCorrectType[columnNumber] && addedDataCorrectType[columnNumber] < this.rows[i + 1][columnNumber]) {
                            //             positionOfElements = i + 1;
                            //             break;
                            //         }
                            //     }
                            //
                            //     this.rows.splice(positionOfElements, 0, addedDataCorrectType);
                            //     tableBody.insertBefore(rowFragment, tableBody.children[positionOfElements]);
                            // }
                        }




                        if (this.sortingDirection[columnNumber] === 'down') {
                            if (addedDataCorrectType[columnNumber] > this.rows[columnNumber][0]) {
                                this.rows.unshift(addedDataCorrectType);
                                tableBody.insertBefore(rowFragment, tableBody.children[0]);

                            } else if (addedDataCorrectType[columnNumber] < this.rows[this.rows.length - 1][columnNumber]) {
                                this.rows.push(addedDataCorrectType);
                                tableBody.appendChild(rowFragment);
                            } else {

                                for (let i = 0; i < (this.rows.length - 1); i++) {

                                    if (this.rows[i][columnNumber] > addedDataCorrectType[columnNumber] && addedDataCorrectType[columnNumber] > this.rows[i + 1][columnNumber]) {
                                        positionOfElements = i + 1;
                                        break;
                                    }
                                }

                                this.rows.splice(positionOfElements, 0, addedDataCorrectType);
                                tableBody.insertBefore(rowFragment, tableBody.children[positionOfElements]);
                            }
                        }
                    }
                    this.addForm.reset();
                } else {
                    this.addForm.reset();
                    throw "Table data number is not suit to columns number";
                }
            };
        }
    }

    window.Grid = Grid;

}());