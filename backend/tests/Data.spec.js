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

describe("Operations performed on Data", () => {

  test("Program should be able to successfully get data (req, res)", () => {
    const req = mockRequest({ session_token: '22d40d3978dd7945bbfcc0bc32a078e2129a253a97cbb04cbb71bc8c506aa9c5'});
    const res = mockResponse();

    getData(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith("status_code:200");
  });

  test("Program should not get data when session token is invalid (req, res)", () => {
    const req = mockRequest({ session_token: '000000000000'});
    const res = mockResponse();

    getData(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith("status_code:400");
  });

  test("Program should be able to successfully delete data (req, res)", () => {
    const req = mockRequest({data_id: '123'}, { session_token: '22d40d3978dd7945bbfcc0bc32a078e2129a253a97cbb04cbb71bc8c506aa9c5'});
    const res = mockResponse();

    deleteData(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith("status_code:200");
  });

  test("Program should not be able to delete data when session token is invalid (req, res)", () => {
    const req = mockRequest({data_id: '123'}, { session_token: '019300001'});
    const res = mockResponse();

    deleteData(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith("status_code:400");
  });

  test("Program should not be able to delete data when invalid data id is provided (req, res)", () => {
    const req = mockRequest({data_id: '000'}, { session_token: '22d40d3978dd7945bbfcc0bc32a078e2129a253a97cbb04cbb71bc8c506aa9c5'});
    const res = mockResponse();

    deleteData(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith("status_code:400");
  });

  test("Program should be able to successfully upload data (req, res)", () => {
    const req = mockRequest({name: 'IMAGE_SET_1'}, { session_token: '22d40d3978dd7945bbfcc0bc32a078e2129a253a97cbb04cbb71bc8c506aa9c5'});
    const res = mockResponse();

    uploadData(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith("status_code:200");
  });

  test("Program should not be able to upload data when invalid session token is provided (req, res)", () => {
    const req = mockRequest({name: 'IMAGE_SET_1'}, { session_token: '000000000000'});
    const res = mockResponse();

    uploadData(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith("status_code:400");
  });

  test("Program should not be able to upload data when an invalid name is given (req, res)", () => {
    const req = mockRequest({name: '22133*!'}, { session_token: '22d40d3978dd7945bbfcc0bc32a078e2129a253a97cbb04cbb71bc8c506aa9c5'});
    const res = mockResponse();

    uploadData(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith("status_code:400");
  });

  test("Program should be able to successfully modify existing data (req, res)", () => {
    const req = mockRequest({name: 'IMAGE_SET_1'}, {data_id: '123'}, { session_token: '22d40d3978dd7945bbfcc0bc32a078e2129a253a97cbb04cbb71bc8c506aa9c5'});
    const res = mockResponse();

    modifyData(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith("status_code:200");
  });


});
