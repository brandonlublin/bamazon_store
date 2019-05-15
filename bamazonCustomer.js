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
    logInventory();   
});

function logInventory() {
    inquirer.prompt({
        name: 'itemList',
        type: 'confirm',
        message: 'Would you like to view our inventory?',
    }).then(function(answer) {
        var query = 'SELECT * FROM products;';
        connection.query(query, function(err, selectedItem) {
            console.log(answer.itemList);
            
            if (answer.itemList === true) {
            for (let i = 0; i < selectedItem.length; i++) {
                    //log each item and it's details to the console
                    console.log(
                        'Item Number: ' + 
                        selectedItem[i].item_id + '\n' +
                        'Product Name: ' + 
                        selectedItem[i].product_name + '\n' +
                        'Department: ' + 
                        selectedItem[i].department_name + '\n' +
                        'Price: ' + 
                        selectedItem[i].price + '\n' +
                        'Quantity in Stock: ' + 
                        selectedItem[i].stock_quantity + '\n\n' 
                    );
                }
                runBamazon();
            } else {
                console.log('No worries, please come back once you need some stuff!');
                connection.end();
            }
            //run item and quantity prompts
            
        })
    })
};

function runBamazon() {
    inquirer.prompt([{
        type: 'list',
        name: 'itemId',
        message: 'What item number are you looking for today?',
        choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
        type: 'input',
        name: 'quantity',
        message: 'How many do you need?',
    }
    ]).then(function(answer) {
            connection.query('SELECT * FROM products WHERE item_id=?', [answer.itemId], function(err, res) {
                if (err) {
                    throw new Error(err)
                }
                for (let i = 0; i < res.length; i++) {
                    //storing return as variable
                    let item = res[i];
                    if (answer.quantity > res[i].stock_quantity) {
                        console.log('\n\nSorry, We have insufficient quantity of that item');
                    } else {
                    
                        // logging each item selected from query in a pretty way
                        console.log(
                            'You\'ve selected: \n--------- ' + 
                            '\nItem #: ' +
                                item.item_id + '\n' + 
                            'Product: ' + 
                                item.product_name + '\n' +
                            'Item Price: $' + 
                                item.price.toFixed(2) + '\n'
                        );
                        let newStockQty = res[i].stock_quantity - answer.quantity;
                        let cost = res[i].price * answer.quantity;
                
                        purchaseConfirm(newStockQty, item, cost)
                        
                    }
                };
            });
    })
    .catch(function(err){
        console.log('error dude');
        
    })
};

function purchaseConfirm(newStockQty, item, cost) {
    
    inquirer
    .prompt({
        type: 'confirm',
        name: 'validatePurchase',
        message: 'Would you like to complete your purchase??',
    }).then(function(answer) {
        if (answer.validatePurchase === true) {
            console.log('\nGreat! your total is $' + cost.toFixed(2) + '.\n' +
            '\nThere is now ' + newStockQty + ' left of that item.\n');
            
        } else {
        //let the user know that they aren't a complete failure for not wanting to buy something from this awesome store
            console.log('Ok, no worries. Come back when you\'re ready to complete your purchase!');
        }
        let query = 'UPDATE products SET ? WHERE ?';
        //reconnect to DB to update the stock quantity for the item selected
        connection.query(query, [{stock_quantity: newStockQty}, {item_id: item.item_id}], function(err, res) {
            if (err) {
                throw new Error(err);
            } else if (res) {
                connection.end();
            };
        });
    });
};