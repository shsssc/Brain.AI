const deleteData = require('../controllers/deleteData')
const getData = require('../controllers/getData')
const uploadData = require('../controllers/uploadData')
const modifyData = require('../controllers/modifyData')

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (sessionData) => {
  return {
    swagger: { params: sessionData }
  };
};

describe("Operations performed on Models", () => {

  test("Program should be able to successfully get the required Model (req, res)", () => {
    const req = mockRequest({ session_token: '22d40d3978dd7945bbfcc0bc32a078e2129a253a97cbb04cbb71bc8c506aa9c5'});
    const res = mockResponse();

    getModel(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith("status_code:200");
  });

  test("Program should not get Model if bad input parameter (req, res)", () => {
    const req = mockRequest({ session_token: '000000000000'});
    const res = mockResponse();

    getModel(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith("status_code:400");
  });

  test("Program should be able to successfully delete the required Model (req, res)", () => {
    const req = mockRequest({model_id: '123'} ,{ session_token: '22d40d3978dd7945bbfcc0bc32a078e2129a253a97cbb04cbb71bc8c506aa9c5'});
    const res = mockResponse();

    deleteModel(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith("status_code:200");
  });

  test("Program should not be able to delete the Model if invalid session token is provided (req, res)", () => {
    const req = mockRequest({model_id: '123'} ,{ session_token: '22d40d3978dd7945bbfcc0bc32a078e2129a253a97cbb04cbb71bc8c506aa9c5'});
    const res = mockResponse();

    deleteModel(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith("status_code:400");
  });

  test("Program should not be able to delete the Model if wrong or invalid model id is provided (req, res)", () => {
    const req = mockRequest({model_id: '000000000000'} ,{ session_token: '22d40d3978dd7945bbfcc0bc32a078e2129a253a97cbb04cbb71bc8c506aa9c5'});
    const res = mockResponse();

    deleteModel(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith("status_code:400");
  });

  test("Program should be able to successfully change the required Model (req, res)", () => {
    const req = mockRequest({model_id: 123}, { session_token: '22d40d3978dd7945bbfcc0bc32a078e2129a253a97cbb04cbb71bc8c506aa9c5'}, {name: 'Best Model Ever'});
    const res = mockResponse();

    modifyModel(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith("status_code:200");
  });

  test("Program should not be able to modify the Model if invalid session token is passed(req, res)", () => {
    const req = mockRequest({model_id: 123}, { session_token: '22d40d3978dd7945bbfcc0bc32a078e2129a253a97cbb04cbb71bc8c506aa9c5'}, {name: 'Best Model Ever'});
    const res = mockResponse();

    modifyModel(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith("status_code:400");
  });

  test("Program should not be able to modify the Model if wrong or invalid model id is provided (req, res)", () => {
    const req = mockRequest({model_id: 000000000000}, { session_token: '22d40d3978dd7945bbfcc0bc32a078e2129a253a97cbb04cbb71bc8c506aa9c5'}, {name: 'Best Model Ever'});
    const res = mockResponse();

    modifyModel(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith("status_code:400");
  });

});
