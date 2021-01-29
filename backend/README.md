# Documentation

## File-wise functionality

### config

`passport.js`

    This contains a function that reads the JWT token from the request, and checks if it actually has a user or is bullshit.

### models

`Users.js`

    This contains the model for a user.

<br>

### validation

`register.js`

    This contains a function that validates the given name,email,password,password1 that is given during registration. It checks for things like email format, and minimum character restraints and if the passwords are the same.

`login.js`

    This contains a function that validates the given email,password that is given during login. This checks for empty strings and email format

### routes/api

`users.js`

    This contains the api endpoints required for login and register

## APIs

- http://localhost:4000/api/users/register

  This takes email,username,password1,password2 and tries to create an account with it. If any error, like if the email is an empty string, or if it already exists, it will return a json object with the key being "email" and the string being the error text. similarly for username, and for error with password.

- http://localhost:4000/api/users/login

  This takes email, password1 and tries to log into an account with it. If any error, like if the email is an empty string, or if it already exists, it will return a json object with the key being "email" and the string being the error text. similarly for error with password. If the login is successful it sends the following json object

  ```code
  {
    "success": true,
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMDU2Yzg5NThlYzEzMmUzNmU1YmZhYiIsIm5hbWUiOiJzc3MiLCJpYXQiOjE2MTA5NjgzNjQsImV4cCI6MTY0MjUyNTI5MH0.sTN4n9E4yPBbfRKo5_Rsyudd9tqu_TdiHTyoXHGxIZY"
  }
  ```
