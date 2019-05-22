# bamazon_store
Bamazon is a Amazon-like application that will simulate a user interacting with items registered in the online store. This can come from either the customer perspective, or the managers perspective.

## Deployment

    Clone repo: github.com/brandonlublin/bamazon_store on your local computer
    Run npm install 
    At command prompt, run node bamazonCustomer.js or bamazonManager.js

## Bamazon Customer ::

#### Code Walkthrough: 
##### Welcome to Bamazon!
    Would you like to view our inventory? (Y/n) 
###### Inventory displays to the customer. They can then choose from the listed inventory to find out some more options for that selected item. Once the item is selected, the application will ask the user how many of that item they would like to purchase. If there is stock available, the application will add up the price to present to the user. If the user confirms, the quantity of that item will update the MySQL Database with the new quantity.
###### If the user does not want the item, the application is cancelled and the user is brought back to the main menu.

##### [Video Demo of Customer](https://cl.ly/31e2fffeb41c)

## Bamazon Manager ::

#### Code Walkthrough: 

    Please select an option: (Use arrow keys)
    View Products for Sale 
    View Low Inventory 
    Add to Inventory 
    Add New Product
    Nothing right now, I'm not feeling well so I'm heading home sick

##### Based off the above command, the user has the option to either view the products in stock, determine what product is low in quantity, add to the low inventory, add a new product entirely, or not do anything. If they choose not to do anything, the application will restart.

##### [Video Demo of Manager](https://cl.ly/183596856951)


