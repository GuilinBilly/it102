<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Grocery List</title>
  </head>
  <body>
    <h2>Grocery List</h2>
    Enter grocery items separated by commas.
    <br>
    <textarea id="groceryInput" placeholder='Enter grocery items and sperate with comma ","when finished.'></textarea>
    <br>
    <button onclick="createGroceryList()">Create Grocery List</button>
    <p id="groceryList"></p>
    <p>Total items: <span id="totalItems"></span></p>

  <script>
  
    //1. Check for empty input from user
    
    function createGroceryList() {
     var userInput = document.getElementById("groceryInput").value;

if (userInput == "" || userInput.trim() === "") {
  alert("enter grocery items");
  document.getElementById("groceryInput").focus();
  return;
}

    
    
    //2.  Split input string into array
    var groceryItems = userInput.split(",");
    
    //3.  Trim white space from each items by looping through array
    
groceryItems[0] = groceryItems[0].trim();
alert(groceryItems[0].length);

for (var i = 0; i < groceryItems.length; i++) {
  groceryItems[i] = groceryItems[i].trim();
}

    //4.  Sort groceryItems alphabetically
    alert("Before sorting: " + groceryItems);
groceryItems.sort();
alert("After sorting: " + groceryItems);
    
    //5.  Display grocery list to webpage
    document.getElementById("groceryList").innerHTML = groceryItems.join("<br>");
document.getElementById("totalItems").innerHTML = groceryItems.length;

    };

  </script>
  </body>
</html>
