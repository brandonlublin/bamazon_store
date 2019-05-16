const inquirer = require('inquirer');
const mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "Zonahawk26!",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) {
        throw err;
    }
    workToDo();
});

function workToDo() {
    inquirer
    .prompt({
        type: 'list',
        name: 'toDo',
        message: 'What\'s crackalackin Boss?',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Nothing right now, I\'m not feeling well so i\'m heading home sick']
    }).then((answer) => {
        switch (answer.toDo) {
            case 'View Products for Sale':      
                viewProd();
            break;
            case 'View Low Inventory':      
                viewLowInv();
            break;
            case 'Add to Inventory':      
                addInv();
            break;
            case 'Add New Product':
                newProd();
            break;
            default: 'Nothing right now, I\'m not feeling well so I\'m heading home sick'
                console.log('\nOk, hope ya feel better! See ya tomorrow.\n');
                connection.end();
            break;
        }
    })
}

function viewProd() {
    let query = 'SELECT * FROM products';
        connection.query(query, function(err, res) {
            // console.log(res);
            for (let i = 0; i < res.length; i++) {
                let products = res[i];
                // console.log(products);
                console.log(
                    'Item Number: ' + 
                    products.item_id + '\n' +
                    'Product Name: ' + 
                    products.product_name + '\n' +
                    'Department: ' + 
                    products.department_name + '\n' +
                    'Price: ' + 
                    products.price + '\n' +
                    'Quantity in Stock: ' + 
                    products.stock_quantity + '\n' 
                );
            };
            console.log('\nWe have some great stuff!\n');
            workToDo();
        });
};

function viewLowInv() {
    let query = 'SELECT * FROM products WHERE stock_quantity <= 10';
    connection.query(query, function(err, res) {
        if (err) {
            throw new Error(err)
        };
        console.log('Here are the products we have in stock that have less than 10 units left: \n');
        let lowItem;
        for (let i = 0; i < res.length; i++) {
            let products = res[i];
            lowItem = products.item_id;
            console.log(
                'Item Number: ' + 
                products.item_id + '\n' +
                'Product Name: ' + 
                products.product_name + '\n' +
                'Department: ' + 
                products.department_name + '\n' +
                'Price: ' + 
                products.price + '\n' +
                'Quantity in Stock: ' + 
                products.stock_quantity + '\n' 
            );
        };
        console.log('We might need to add some product!\n');
        inquirer
        .prompt({
            type: 'list',
            name: 'inventoryAction',
            message: 'Would you like to add inventory or buy new products?',
            choices: ['I think I want to add some new inventory to our existing low items.', 'Let\'s add this new product I found!', 'Nothing write now, I\'m going home']
        }).then(function(answer) {  
            console.log(answer.inventoryAction);
            if (answer.inventoryAction === 'Nothing right now, I\'m going home.') {
                console.log('\nSounds good, Have a good night.');
                connection.end();
            } else {
                switch (answer.inventoryAction) {
                    case 'I think I want to add some new inventory to our existing low items.':
                        addInv(lowItem);
                    break;
                    case 'Let\'s add this new product I found!':
                        newProd();
                    break;
                };
            };
        });
    });
};

function addInv() {
    inquirer
    .prompt([{
        type: 'input',
        name: 'itemInv',
        message: 'Which item would you like to add some inventory to?',
    },
    {
        type: 'input',
        name: 'quantity',
        message: 'What would you like to change the inventory to?',
    }
    ]).then(function(answer) {
        let item = answer.itemInv;
        let quantityToAdd = answer.quantity;
        if (isNaN(item)) {
            console.log('no');
        } else {
            let query = 'UPDATE products SET ? WHERE ?'
            connection.query(query, [{stock_quantity:  quantityToAdd}, {item_id: item}], function(err, res) {
                if (err) {
                    throw new Error(err)
                } else if (res) {
                    console.log('\nThe updated inventory for item number ' + item + ' is now set to: ' + quantityToAdd + '\n');
                    workToDo();
                }
            })
        }
        
    })
};

function newProd() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'product_name',
            message: 'Please enter the new product name: ',
        },
        {
            type: 'input',
            name: 'department_name',
            message: 'Which department should I log this item to?',
        },
        {
            type: 'input',
            name: 'price',
            message: 'How much does each unit cost?',
        },
        {
            type: 'input',
            name: 'stock_quantity',
            message: 'How many items are in stock?',
        },
    ])
    .then(function(answer) {
        // console.log('input: ' + JSON.stringify(input));

        console.log(
            '\nNew Item being added: \n' + 
            'Product Name: ' +
            answer.product_name + '\n' +
            'Department Name: ' +
            answer.department_name + '\n' +
            'Price: ' +
            answer.price +'\n' +
            'Stock Quantity: ' +
            answer.stock_quantity
        );

        // Create the insertion query string
        var queryStr = 'INSERT INTO products SET ?';

        // Add new product to the db
        connection.query(queryStr, answer, function(error, results, fields) {
            if (error) throw error;

            console.log(
            '\nNew product has been added to the inventory under Item ID ' +
            results.insertId +
            '.'
        );
          // End the database connection
        connection.end();
        });
    });
}