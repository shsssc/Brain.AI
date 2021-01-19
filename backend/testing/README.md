# Black box restful API testing of backend server

## Overview
In this section, we perform black box restful api testing of backend.
All module were tested.\
This testing was performed via the [Tavern](https://taverntesting.github.io/) project.  

## Running the test
### To make sure that Tavern can find external functions you need to make sure that testing_utils.py is in the Python path.

To run the test, run:\
pip install tavern\
pip install tavern[pytest]\
py.test test_minimal.tavern.yaml  -v

## test cases
<pre>
/user username_create: successfully created user
expected response:
    status_code:200

/user username_create: bad input parameter
expected response:  
    status_code:400

/user username_create: conflict username
expected response: 
    status_code:409

/user login: successfully login
expected response:
    status_code:200
    JSON:{ user_token: test_login_token} 

/user login: bad input parameter
expected response: 
    status_code:400

/user login: bad credential
expected response:
    status_code:401

/data upload new data: successfully
expected response:
    status_code:200 
    JSON:{ data_id: test_data_id}

/data upload new data: bad input parameter
expected response: 
    status_code:400

/data upload new data: bad token
expected response: 
    status_code:401

/data successfully renamed the data
    response:
      status_code:
        - 200

/data unsuccessfully renamed the data bad input parameter
    response:
      status_code:
        - 400

/data unsuccessfully renamed the data bad token
    response:
      status_code:
        - 401

/data  successfully list data
    response:
      status_code:
        - 200

/data unsuccessfully list data bad input parameter
    response:
      status_code:
        - 400

/model successfully list models
    response:
      status_code:
        - 200    

/model unsuccessfully list models bad input parameter
    response:
      status_code:
        - 400
 
/model name: successfully updated the model
    response:
      status_code:
        - 200
    
/model unsuccessfully updated the model bad input parameter
    response:
      status_code:
        - 400 
        
/model unsuccessfully updated the model bad token
    response:
      status_code:
        - 401
           
/model check updated model by lisiting model
    response:
      status_code:
        - 200    
      verify_response_with:
        m = response.json()[0]
        assert m.get("id") == 6
        assert m.get("shared") == 0
        assert m.get("name") == "newnewnew"

/task successfully created task
    response:
      status_code:
        - 200    

/task unsuccessfully created task bad input parameter
    response:
      status_code:
        - 400    

/task successfully listed task
    response:
      status_code:
        - 200    
    verify_response_with:
        test_task_id retruned by the created task is in the reponse of listed task

 /task unsuccessfully listed task bad input parameter
    response:
      status_code:
        - 400    

/task successfully stopped the task
    response:
      status_code:
        - 200    

 /task unsuccessfully stopped the task bad input parameter
    response:
      status_code:
        - 400    

 /task unsuccessfully stopped the task bad token
    response:
      status_code:
        - 401  

 /task successfully removed the task
      status_code:
        - 200

 /task unsuccessfully removed the task bad input parameter
    response:
      status_code:
        - 400
  
 /task unsuccessfully removed the task bad token
    response:
      status_code:
        - 401

 /task check removed task
    response:
      status_code:
        - 200    
      verify_response_with:
        deleted task_id should not be found in the response
  
 /task  successfully removed the data
    response:
      status_code:
        - 200

 /task  unsuccessfully removed the data bad input parameter
    response:
      status_code:
        - 400

 /task  unsuccessfully removed the data bad token
    response:
      status_code:
        - 401

/user log out: successfully
    expected response:
        status_code:200

/user log out: bad input parameter
    expected response:
        status_code:400

/user log out: bad token
    expected response:
        status_code:401
</pre>