# Testing backend controller functionality

## Overview
In this section, we perform unit tests on controller functionality that largely represent the use cases we are developing. We test the working
of each function in Data, Model & User modules. 
The testing was performed using the [Jest](https://jestjs.io/) framework. 

## Running the test
1. Clone the repository
2. Run `npm install`
3. Run `npm run test`

## Test cases
<pre>

**User.js functional test cases**
/user createUser: successfully create a user
expected response:
    status_code:200
test success: same as expected response
test failure: bad status code returned

/user username_create: bad input parameter
expected response:  
    status_code:400
test success: same as expected response
test failure: bad status code returned

/user login: successfully login
expected response:
    status_code:200
    JSON:{ user_token: test_login_token} 
test success: expected status code & user token returned
test failure: bad status code returned

/user login: bad input parameter
expected response: 
    status_code:400
test success: expected status code returned
test failure: bad status code returned

/user login: bad credential
expected response:
    status_code:409
test success: expected status code returned
test failure: bad status code returned

/user log out: successfully log out user
expected response:
    status_code:200
test success: expected status code returned
test failure: bad status code returned

/user log out: bad input parameter
expected response:
    status_code:400
test success: expected status code returned
test failure: bad status code returned

**Data.js functional test cases**
/data upload new data: successfully
expected response:
    status_code:200 
    JSON:{ data_id: test_data_id}
test success: expected status code & data id returned
test failure: bad status code returned

/data upload new data: bad input parameter
expected response: 
    status_code:400
test success: expected status code returned
test failure: bad status code returned

/data upload new data: bad token
expected response: 
    status_code:401
test success: expected status code returned
test failure: bad status code returned

**Model.js functional test cases**
/model get existing model: successfully
expected response:
    status_code:200 
    JSON:{ model: []}
test success: expected status code & array of objects returned
test failure: bad status code returned

/model get existing model: bad input parameter
expected response: 
    status_code:400
test success: expected status code returned
test failure: bad status code returned

/model delete existing model: successfully
expected response: 
    status_code:200
test success: expected status code returned
test failure: bad status code returned

/model delete existing model: bad input parameter
expected response: 
    status_code:400
test success: expected status code returned
test failure: bad status code returned

/model modify existing model: successfully
expected response: 
    status_code:200
test success: expected status code returned
test failure: bad status code returned

/model modify existing model: bad input parameter
expected response: 
    status_code:400
test success: expected status code returned
test failure: bad status code returned
</pre>
