class CustomErrorHandler extends Error{
    constructor(status, message) {
        super();
     this.status = status;
     this.message = message;
    };
    static alreadyRegistered(message ) {
        return new CustomErrorHandler(409, message);
      }

      static AllFieldsRequired(message ){
        return new CustomErrorHandler(400, message);
      }

      static notFound(message ){
        return new CustomErrorHandler(404, `${message} not found`)
      }

      static CustomError(status  , message ){
        return new CustomErrorHandler(status, message)
      }

      static unAuthorized(){
        return new CustomErrorHandler(401, "UnAuthorized");
      }
      static invalidCredentials(){
        return new CustomErrorHandler(403, "Invalid credentials")
      }
    }

    module.exports = CustomErrorHandler