# splitkaro-assignment

Internship assignment for Splitkaro

### Steps to run the project

1. run: git clone https://github.com/JashanPuri/splitkaro-assignment.git (To clone the repo)
2. run: npm install (to install all the packages mentioned in package.json)
3. run: npm start (the server will start running on port 3000 by default)
4. open postman and test

### API Endpoints

1. POST http://localhost:3000/api/v1/groups - Create group

2. POST http://localhost:3000/api/v1/groups/{groupId}/expense - Add expense to group with id = groupId

3. PATCH http://localhost:3000/api/v1/groups/{groupId}/expense/{expenseId} - Updates expense with expenseId of group with groupId

4. DELETE http://localhost:3000/api/v1/groups/{groupId}/expense/{expenseId} - Deletes expense with expenseId of group with groupId

5. GET http://localhost:3000/api/v1/groups/{groupId}/balance - Gets the balance of the group


### Steps to run postman collection

Attached is a postman collection for above mentioned points - Splitkaro-Assignment.postman_collection.json

Import the collection to postman.

Set the following environment variables:
1. URL - localhost:localhost:3000/api/v1
2. groupId - null
3. expenseId1 - null

Run the collection
