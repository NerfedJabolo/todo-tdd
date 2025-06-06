const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../models/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todos.json');

TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.findByIdAndUpdate = jest.fn();
TodoModel.findByIdAndDelete = jest.fn();

const todoId = '683d4fc95b81634b2569047f';

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('TodoController.createTodo', () => {
  beforeEach(() => {
    req.body = newTodo;
  });
  it('should have a createTodo function', () => {
    expect(typeof TodoController.createTodo).toBe('function');
  });
  it('should call TodoModel.create', () => {
    TodoController.createTodo(req, res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });
  it('Should return 201 response code', async () => {
    await TodoController.createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('Should return json body in response', async () => {
    await TodoModel.create.mockReturnValue(newTodo);
    await TodoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });
  it('Should handle errors', async () => {
    const errorMessage = { message: 'Done property missing' };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.create.mockReturnValue(rejectedPromise);
    await TodoController.createTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('TodoController.getTodos', () => {
  it('should have a getTodos function', () => {
    expect(typeof TodoController.getTodos).toBe('function');
  });
  it('Should call TodoModel.find({})', async () => {
    await TodoController.getTodos(req, res, next);
    expect(TodoModel.find).toHaveBeenCalledWith({});
  });
  it('should return response with status 200 and all todos', async () => {
    TodoModel.find.mockReturnValue(allTodos);
    await TodoController.getTodos(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allTodos);
  });
  it('Should handle errors', async () => {
    const errorMessage = { message: 'Something went wrong' };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.find.mockReturnValue(rejectedPromise);
    await TodoController.getTodos(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('TodoController.getTodoById', () => {
  it('should have a getTodoById', () => {
    expect(typeof TodoController.getTodoById).toBe('function');
  });
  it('should call TodoModel.findById with route parameters', async () => {
    req.params.todoId = '683d4fc95b81634b2569047f';
    await TodoController.getTodoById(req, res, next);
    expect(TodoModel.findById).toBeCalledWith('683d4fc95b81634b2569047f');
  });
  it('should return response with 200 status and todo', async () => {
    TodoModel.findById.mockReturnValue(newTodo);
    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'error finding todoModel' };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findById.mockReturnValue(rejectedPromise);
    await TodoController.getTodoById(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
  it('should return 404 when item does not exist', async () => {
    TodoModel.findById.mockReturnValue(null);
    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe('TodoController.updateTodo', () => {
  it('should have a updateTodo function', () => {
    expect(typeof TodoController.updateTodo).toBe('function');
  });
  it('should update with TodoModel.findByIdAndUpdate', async () => {
    req.params.todoId = todoId;
    req.body = newTodo;
    await TodoController.updateTodo(req, res, next);
    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
      new: true,
      useFindAndModify: false,
    });
  });
  it('should return a response with json data and http 200 code', async () => {
    req.params.todoId = todoId;
    req.body = newTodo;
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
    await TodoController.updateTodo(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'error finding todoModel' };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await TodoController.updateTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
  it('should return 404 when item does not exist', async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(null);
    await TodoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

//Delete tests

describe('TodoController.deleteTodo', () => {
  it('should have a deleteTodo function', () => {
    expect(typeof TodoController.deleteTodo).toBe('function');
  });
  it('should delete with TodoModel.findByIdAndDelete', async () => {
    req.params.todoId = todoId;
    await TodoController.deleteTodo(req, res, next);
    expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(todoId);
  });
  it('should return a response with json data and http 200 code', async () => {
    req.params.todoId = todoId;
    TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
    await TodoController.deleteTodo(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });
  it('should handle errors', async () => {
    const errorMessage = { message: 'error finding todoModel' };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    await TodoController.deleteTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
  it('should return 404 when item does not exist', async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(null);
    await TodoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
