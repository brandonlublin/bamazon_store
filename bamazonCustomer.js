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
    console.log('Welcome to Bamazon!');
    
});

function logInventory() {
    var query = 'SELECT * FROM products;';
    connection.query(query, function(err, selectedItem) {
        for (let i = 0; i < selectedItem.length; i++) {
            let itemInCart = selectedItem[i]
            console.log(
                'Product Name: ' + 
                    itemInCart.product_name + '\n' +
                'Department: ' + 
                    itemInCart.department_name + '\n' +
                'Price: ' + 
                    itemInCart.price + '\n' +
                'Quantity in Stock: ' + 
                    itemInCart.stock_quantity + '\n\n' 
            );
        }
    })
};

function runBamazon() {
    let cartTotal = [];
    inquirer
    .prompt({
        name: 'item',
        type: 'list',
        message: 'What item number are you looking for today?',
        choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }).then(function(answer) {
        let query = 'SELECT item_id, product_name, price, stock_quantity FROM products WHERE item_id = "?"';
        connection.query(query, [ answer.item ], function(err, selectedItem) {
            for (let i = 0; i < selectedItem.length; i++) {
                //storing return as variable
                const item = selectedItem[i];
                //logging each item selected from query in a pretty way
                console.log(
                    'You\'ve selected: \n--------- ' + 
                    '\nItem #: ' +
                        item.item_id + '\n' + 
                    'Product: ' + 
                        item.product_name
                );
                //if the quantity is zero, notify user
                if (item.stock_quantity === 0) {
                    console.log('\n\nSorry, We have insufficient quantity of that item');
                } else {
                    //running update query to subtract one from the quantity in stock
                    connection.query('UPDATE products SET stock_quantity = stock_quantity - 1 WHERE item_id = ?', [answer.item], function(err, selectedItem) {
                        console.log('\nQuantity Remaining of the ' + item.product_name + ': ' + item.stock_quantity);
                    });
                };
            };
        });
    });
    
};
runBamazon();